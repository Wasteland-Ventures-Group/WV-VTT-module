import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import {
  CONSTANTS,
  ProtoItemTypes,
  SYSTEM_COMPENDIUM_SOURCE_ID_REGEX
} from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import { RULE_ELEMENTS } from "../ruleEngine/ruleElements.js";
import type RuleElementSource from "../ruleEngine/ruleElementSource.js";
import { LOG } from "../systemLogger.js";
import validateSystemData from "../validation/validateSystemData.js";

/** The basic Wasteland Ventures Item. */
export default class WvItem extends Item {
  /** The ready flag for the constructor context. */
  private static readonly READY = { wastelandVentures: { ready: true } };

  /**
   * Decorate the passed context with the context ready flag.
   * @param context - the originally passed constructor context
   * @returns the decorated context
   */
  private static readyContext(
    context: ConstructorParameters<typeof Item>[1]
  ): ItemContext {
    return { ...WvItem.READY, ...context };
  }

  /**
   * Create a new WvItem or subclass registered in
   * {@link TYPE_CONSTRUCTORS.ITEM}.
   * @see Item.constructor
   */
  constructor(
    data?: ConstructorParameters<typeof Item>[0],
    context?: ItemContext
  ) {
    // This whole thing needs to break the recursion that happens by calling the
    // super constructor, since we just return something of our own.

    // Check if we have been through the other branch at least once, if so just
    // call super.
    if (context?.wastelandVentures?.ready) {
      super(data, context);
    } else {
      if (data && isMappedItemType(data.type)) {
        // If we are able to find a mapped constructor, then use that one
        // instead and instantiate a subclass of WvItem with the readied
        // context to break out of the recursion.
        return new (getGame().wv.typeConstructors.item[data.type])(
          data,
          WvItem.readyContext(context)
        );
      }

      // If we are not able to, just instantiate a WvItem with the readied
      // context to break out of the recursion.
      super(data, WvItem.readyContext(context));
    }
  }

  /** Get the amount of the item, if it has any. */
  get amount(): number | undefined {
    return "amount" in this.data.data ? this.data.data.amount : undefined;
  }

  /** Get RuleElements that apply to this Item. */
  get applicableRuleElements(): RuleElement[] {
    return this.data.data.rules.elements.filter(
      (rule) => rule.target === "item"
    );
  }

  /** Check whether the item has a compendium link in its flags. */
  get hasCompendiumLink(): boolean {
    const sourceId = this.getFlag("core", "sourceId");
    if (typeof sourceId !== "string") return false;

    return SYSTEM_COMPENDIUM_SOURCE_ID_REGEX.test(sourceId);
  }

  /** Check whether the item has a compendium link that is currently enabled. */
  get hasEnabledCompendiumLink(): boolean {
    return (
      this.hasCompendiumLink &&
      !this.getFlag(CONSTANTS.systemId, "disableCompendiumLink")
    );
  }

  /** Check whether the item has the type of one of the prototype items. */
  get isProtoItemType(): boolean {
    return ProtoItemTypes.includes(this.data.type);
  }

  /**
   * Get the total value of the item, if it has a value. If the amount is
   * undefined, 1 is used.
   */
  get totalValue(): number | undefined {
    if (typeof this.value === "undefined") return undefined;

    return this.value * (this.amount ?? 1);
  }

  /**
   * Get the total weight of the item, if it has a weight. If the amount is
   * undefined, 1 is used.
   */
  get totalWeight(): number | undefined {
    if (typeof this.weight === "undefined") return undefined;

    return this.weight * (this.amount ?? 1);
  }

  /** Get the value of the item, if it has any. */
  get value(): number | undefined {
    return "value" in this.data.data ? this.data.data.value : undefined;
  }

  /** Get the weight of the item, if it has any. */
  get weight(): number | undefined {
    return "weight" in this.data.data ? this.data.data.weight : undefined;
  }

  override prepareBaseData(): void {
    this.data.data.rules.elements = this.data.data.rules.sources.map(
      (ruleSource) => new RULE_ELEMENTS[ruleSource.type](ruleSource, this)
    );
  }

  override prepareEmbeddedDocuments(): void {
    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onAfterSpecial());
  }

  /** Toggle the compendium link for this item. */
  async toggleCompendiumLink(): Promise<void> {
    const newValue = !this.getFlag(CONSTANTS.systemId, "disableCompendiumLink");
    LOG.debug(
      `Toggling "disableCompendiumLink" for [${this.id}] to ${newValue}`
    );
    await this.update({
      flags: { [CONSTANTS.systemId]: { disableCompendiumLink: newValue } }
    });
  }

  /**
   * Update the RuleElement sources of this Effect.
   * @param sources - the new RuleElements
   */
  updateRuleSources(sources: RuleElementSource[]): void {
    this.update({
      _id: this.id,
      data: { rules: { sources: sources } }
    });
  }

  /**
   * Update the item from its compendium link, if one exists. This ignores
   * whether the compendium link for this item is broken.
   */
  async updateFromCompendium(): Promise<void> {
    if (!this.hasCompendiumLink) return;

    LOG.debug(`Updating item from Compendium [${this.id}] "${this.name}"`);
    await this.update(
      { ...(await getUpdateDataFromCompendium(this)) },
      { recursive: false, diff: false }
    );
  }

  protected override async _preCreate(
    data: ItemDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preCreate(data, options, user);
    this.validateSystemData(this.data._source.data);
  }

  protected override async _preUpdate(
    changed: DeepPartial<ItemDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preUpdate(changed, options, user);
    this.validateSystemData(
      foundry.utils.mergeObject(this.data._source.data, changed.data ?? {}, {
        recursive: options.recursive,
        inplace: false
      })
    );
  }

  /** Validate passed source system data. */
  protected validateSystemData(data: unknown): void {
    validateSystemData(data, getGame().wv.validators.item[this.data.type]);
  }
}

/**
 * An expanded document constructor context, to hold the ready flag for items.
 */
type ItemContext = ConstructorParameters<typeof Item>[1] & {
  wastelandVentures?: {
    ready?: boolean;
  };
};

/** Flags for items. */
export type ItemFlags = {
  disableCompendiumLink?: boolean;
  overwriteNotesWithCompendium?: boolean;
  overwriteRulesWithCompendium?: boolean;
};

/** Fetch update data for an item from its compendium prototype. */
export async function getUpdateDataFromCompendium(
  item: foundry.documents.BaseItem
): Promise<Record<string, unknown>> {
  const sourceId = item.getFlag("core", "sourceId");
  if (typeof sourceId !== "string") return {};

  const match = SYSTEM_COMPENDIUM_SOURCE_ID_REGEX.exec(sourceId);
  if (!match || !match[1] || !match[2]) return {};

  const compendium = getGame().packs.get(match[1]);
  if (!compendium) return {};

  const document = await compendium.getDocument(match[2]);
  if (!(document instanceof WvItem)) return {};

  const updateData = { data: document.toObject().data };
  if (!item.getFlag(CONSTANTS.systemId, "overwriteNotesWithCompendium")) {
    updateData.data.notes = item.data.data.notes;
  }
  if (!item.getFlag(CONSTANTS.systemId, "overwriteRulesWithCompendium")) {
    updateData.data.rules.sources = item.data.data.rules.sources;
  }
  return updateData;
}

/**
 * A custom typeguard to check whether a string is a mapped type identifier.
 * @param type - the type name to check
 * @returns whether the type name is mapped
 */
export function isMappedItemType(
  type: string
): type is keyof Game["wv"]["typeConstructors"]["item"] {
  return Object.keys(getGame().wv.typeConstructors.item).includes(type);
}

/**
 * A custom typeguard to check whether an Item is of the type, mapped from the
 * type name.
 * @param item - the item to check
 * @param type - the type name to check
 * @returns whether the Item is of the mapped type
 */
export function isOfItemType<
  T extends keyof Game["wv"]["typeConstructors"]["item"]
>(
  item: Item,
  type: T
): item is InstanceType<Game["wv"]["typeConstructors"]["item"][T]> {
  return item instanceof getGame().wv.typeConstructors.item[type];
}

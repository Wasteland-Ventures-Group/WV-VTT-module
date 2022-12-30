import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import {
  CONSTANTS,
  ProtoItemTypes,
  SYSTEM_COMPENDIUM_SOURCE_ID_REGEX
} from "../constants.js";
import { MiscDataPropertiesData } from "../data/item/misc/properties.js";
import { getGame } from "../foundryHelpers.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import {
  ruleElementSort,
  withoutConditions
} from "../ruleEngine/ruleElement.js";
import type { RuleElementHook } from "../ruleEngine/ruleElementSource.js";
import type { RuleElementSource } from "../ruleEngine/ruleElementSource.js";
import { LOG } from "../systemLogger.js";
import validateSystemData from "../validation/validateSystemData.js";

/** The basic Wasteland Ventures Item. */
export default class WvItem extends Item {
  /** Get an identifying string for this Item. */
  get ident(): string {
    const thisIdent = `[${this.id}] "${this.name}"`;
    if (this.parent) {
      return `${this.parent.ident} -> ${thisIdent}`;
    } else {
      return thisIdent;
    }
  }

  /** Get the amount of the item, if it has any. */
  get amount(): number | undefined {
    return "amount" in this.data.data ? this.data.data.amount : undefined;
  }

  /** Check whether the item has a compendium link in its flags. */
  get hasCompendiumLink(): boolean {
    return hasCompendiumLink(this);
  }

  /** Check whether the item has a compendium link that is currently enabled. */
  get hasEnabledCompendiumLink(): boolean {
    return hasEnabledCompendiumLink(this);
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
    if (!("value" in this.data.data)) return undefined;

    return this.data.data.value.total;
  }

  /** Get the weight of the item, if it has any. */
  get weight(): number | undefined {
    if (!("weight" in this.data.data)) return undefined;

    return this.data.data.weight.total;
  }

  override prepareBaseData(): void {
    if (this.data.type === "misc") {
      this.data.data = MiscDataPropertiesData.from(this.data.data, this);
    }
  }

  override prepareEmbeddedDocuments(): void {
    if (this.actor === null) {
      this.data.data.rules.elements
        .filter(withoutConditions)
        .sort(ruleElementSort)
        .forEach((ruleElement) => ruleElement.apply([this]));
      this.apps && this.render();
    }
  }

  /** Get the RuleElements of this Item for the given hook. */
  getRuleElementsForHook(hook: RuleElementHook): RuleElement[] {
    return this.data.data.rules.elements.filter(
      (ruleElement) => ruleElement.hook === hook
    );
  }

  /**
   * Finalize the data of the item. Usually this is only done for owned items
   * and when all computations for the owner are complete.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  finalizeData(): void {}

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
    this.update({ data: { rules: { sources: sources } } });
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

/** Flags for items. */
export type ItemFlags = {
  disableCompendiumLink?: boolean;
  overwriteAmountWithCompendium?: boolean;
  overwriteNotesWithCompendium?: boolean;
  overwriteRulesWithCompendium?: boolean;
};

/** Check whether the passed item has a compendium link in its flags. */
export function hasCompendiumLink(item: foundry.documents.BaseItem) {
  const sourceId = item.getFlag("core", "sourceId");
  if (typeof sourceId !== "string") return false;

  return SYSTEM_COMPENDIUM_SOURCE_ID_REGEX.test(sourceId);
}

/**
 * Check whether the passed item has a compendium link that is currently
 * enabled.
 */
export function hasEnabledCompendiumLink(item: foundry.documents.BaseItem) {
  return (
    hasCompendiumLink(item) &&
    !item.getFlag(CONSTANTS.systemId, "disableCompendiumLink")
  );
}

/** Fetch update data for an item from its compendium prototype. */
export async function getUpdateDataFromCompendium(
  item: foundry.documents.BaseItem
): Promise<{
  data: foundry.documents.BaseItem["data"]["_source"]["data"];
} | null> {
  const sourceId = item.getFlag("core", "sourceId");
  if (typeof sourceId !== "string") return null;

  const match = SYSTEM_COMPENDIUM_SOURCE_ID_REGEX.exec(sourceId);
  if (!match || !match[1] || !match[2]) return null;

  const compendium = getGame().packs.get(match[1]);
  if (!compendium) return null;

  const document = await compendium.getDocument(match[2]);
  if (!(document instanceof WvItem)) return null;

  const updateData = { data: document.toObject().data };
  if (!item.getFlag(CONSTANTS.systemId, "overwriteNotesWithCompendium")) {
    updateData.data.notes = item.data._source.data.notes;
  }
  if (!item.getFlag(CONSTANTS.systemId, "overwriteRulesWithCompendium")) {
    updateData.data.rules.sources = item.data._source.data.rules.sources;
  }
  if ("amount" in updateData.data && "amount" in item.data._source.data) {
    if (!item.getFlag(CONSTANTS.systemId, "overwriteAmountWithCompendium")) {
      updateData.data.amount = item.data._source.data.amount;
    }
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

/** The relation of the owning item to the document that caused a message */
export type DocumentRelation = "thisItem" | "parentActor" | "parentOwnedItem";

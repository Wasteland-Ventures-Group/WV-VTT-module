import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import { getGame } from "../foundryHelpers.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import { RULE_ELEMENTS } from "../ruleEngine/ruleElements.js";
import type RuleElementSource from "../ruleEngine/ruleElementSource.js";
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

  /** Get RuleElements that apply to this Item. */
  get applicableRuleElements(): RuleElement[] {
    return this.data.data.rules.elements.filter(
      (rule) => rule.target === "item"
    );
  }

  override prepareBaseData(): void {
    this.data.data.rules.elements = this.data.data.rules.sources.map(
      (ruleSource) => new RULE_ELEMENTS[ruleSource.type](ruleSource, this)
    );
  }

  override prepareEmbeddedDocuments(): void {
    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onPrepareEmbeddedDocuments());
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

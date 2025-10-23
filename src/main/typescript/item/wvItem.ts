import {
  CONSTANTS,
  ProtoItemTypes,
  type ProtoItemType
} from "../constants.js";
import { MiscProperties } from "../data/item/misc/properties.js";
import { getGame } from "../foundryHelpers.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import {
  ruleElementSort,
  withoutConditions
} from "../ruleEngine/ruleElement.js";
import type { RuleElementHook } from "../ruleEngine/ruleElementSource.js";
import type RuleElementSource from "../ruleEngine/ruleElementSource.js";
import { LOG } from "../systemLogger.js";
import TypeDataModel = foundry.abstract.TypeDataModel;
import { APPAREL_SCHEMA } from "../data/item/apparel/source.js";
import { ApparelProperties } from "../data/item/apparel/properties.js";
import { AmmoProperties } from "../data/item/ammo/properties.js";
import { AMMO_SCHEMA, } from "../data/item/ammo/source.js";
import { MISC_SCHEMA } from "../data/item/misc/source.js";
import type { RACE_SCHEMA } from "../data/item/race/source.js";
import type { RaceProperties } from "../data/item/race/properties.js";
import { EFFECT_SCHEMA } from "../data/item/effect/source.js";
import { WEAPON_SCHEMA } from "../data/item/weapon/source.js";
import { MAGIC_SCHEMA } from "../data/item/magic/source.js";
import { WeaponProperties } from "../data/item/weapon/properties.js";
import { MagicProperties } from "../data/item/magic/properties.js";
import { EffectProperties } from "../data/item/effect/properties.js";
import { AttacksProperties } from "../data/item/weapon/attack/properties.js";

export class WeaponSystem extends TypeDataModel<typeof WEAPON_SCHEMA, WvItem<"weapon">, WeaponProperties> {
  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>) {
    const prop = WeaponProperties.from(this._source, this.parent);
    foundry.utils.mergeObject(this, prop)
  }

  static override defineSchema(): typeof WEAPON_SCHEMA {
    return WEAPON_SCHEMA
  }
}

export class RaceSystem extends TypeDataModel<typeof RACE_SCHEMA, WvItem<"race">, RaceProperties> { }
export class MiscSystem extends TypeDataModel<typeof MISC_SCHEMA, WvItem<"misc">, MiscProperties> {

  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>) {
    const prop = MiscProperties.from(this._source, this.parent);
    foundry.utils.mergeObject(this, prop)
  }

  static override defineSchema(): typeof MISC_SCHEMA {
    return MISC_SCHEMA
  }
}

export class AmmoSystem extends TypeDataModel<typeof AMMO_SCHEMA, WvItem<"ammo">, AmmoProperties> {
  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>) {
    const prop = AmmoProperties.from(this._source, this.parent)
    foundry.utils.mergeObject(this, prop)
  }

  static override defineSchema(): typeof AMMO_SCHEMA {
    return AMMO_SCHEMA
  }
}

export class MagicSystem extends TypeDataModel<
  typeof MAGIC_SCHEMA,
  WvItem<"magic">,
  MagicProperties
> {

  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    const prop = MagicProperties.from(this._source, this.parent);
    foundry.utils.mergeObject(this, prop)
  }

  static override defineSchema(): typeof MAGIC_SCHEMA {
    return MAGIC_SCHEMA
  }
}

export class ApparelSystem extends TypeDataModel<
  typeof APPAREL_SCHEMA,
  WvItem<"apparel">,
  ApparelProperties
> {
  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    const prop = ApparelProperties.from(this._source, this.parent);
    foundry.utils.mergeObject(this, prop)
  }
  static override defineSchema(): typeof APPAREL_SCHEMA {
    return APPAREL_SCHEMA
  }
}

export class EffectSystem extends TypeDataModel<
  typeof EFFECT_SCHEMA,
  WvItem<"effect">,
  EffectProperties
> {
  override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
    const prop = EffectProperties.from(this._source, this.parent);
    foundry.utils.mergeObject(this, prop)
  }

  static override defineSchema(): typeof EFFECT_SCHEMA {
    return EFFECT_SCHEMA
  }
}

/** The basic Wasteland Ventures Item. */
export default class WvItem<ItemType extends ProtoItemType = ProtoItemType> extends Item<ItemType> {
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
    return "amount" in this.system ? this.system.amount : undefined;
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
    return ProtoItemTypes.includes(this.type as ProtoItemType);
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
    if (!("value" in this.system)) return undefined;


    return this.system.value.total;
  }

  /** Get the weight of the item, if it has any. */
  get weight(): number | undefined {
    if (!("weight" in this.system)) return undefined;

    return this.system.weight.total;
  }

  override prepareEmbeddedDocuments(): void {
    if (this.actor === null) {
      this.system.rules.elements
        .filter(withoutConditions)
        .sort(ruleElementSort)
        .forEach((ruleElement) => ruleElement.apply([this]));
      this.apps && this.render();
    }
  }

  /** Get the RuleElements of this Item for the given hook. */
  getRuleElementsForHook(hook: RuleElementHook): RuleElement[] {
    return this.system.rules.elements.filter(
      (ruleElement) => ruleElement.hook === hook
    );
  }

  /**
   * Finalize the data of the item. Usually this is only done for owned items
   * and when all computations for the owner are complete.
   */

  finalizeData(): void { }

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
    this.update({ system: { rules: { sources: sources } } });
  }

  /**
   * Update the item from its compendium link, if one exists. This ignores
   * whether the compendium link for this item is broken.
   */
  async updateFromCompendium(): Promise<void> {
    if (!this.hasCompendiumLink) return;

    LOG.debug(`Updating item from Compendium [${this.id}] "${this.name}"`);
    await this.update(
      await getUpdateDataFromCompendium(this),
      { recursive: false, diff: false }
    );
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
  return item.inCompendium
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
  item: Item,
): Promise<Item.UpdateData | undefined> {

  const pack = item.pack;
  if (!pack) return undefined;

  const compendium = getGame().packs?.get(pack);
  if (!compendium) return undefined;

  if (!item.id) return undefined;
  const document = await compendium.getDocument(item.id);
  if (!(document instanceof WvItem)) return undefined;

  const updateData = { system: document.toObject().system };
  if (!item.getFlag(CONSTANTS.systemId, "overwriteNotesWithCompendium")) {
    updateData.system.notes = item.system._source.notes;
  }
  if (!item.getFlag(CONSTANTS.systemId, "overwriteRulesWithCompendium")) {
    updateData.system.rules.sources = item.system._source.rules.sources;
  }
  if ("amount" in updateData.system && "amount" in item._source) {
    if (!item.getFlag(CONSTANTS.systemId, "overwriteAmountWithCompendium")) {
      updateData.system.amount = item._source.amount;
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

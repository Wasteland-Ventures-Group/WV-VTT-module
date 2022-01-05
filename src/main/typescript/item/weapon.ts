import { TYPES } from "../constants.js";
import type WeaponDataProperties from "../data/item/weapon/properties.js";
import type { WeaponDataSourceData } from "../data/item/weapon/source.js";
import { getGame } from "../foundryHelpers.js";
import validateSystemData from "../validation/validateSystemData.js";
import Attack from "./weapon/attack.js";
import WvItem from "./wvItem.js";

/** An Item that can represent a weapon in the Wasteland Ventures system. */
export default class Weapon extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.WEAPON)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.WEAPON}.`);

    super(data, context);
  }

  /** Get the system data of this weapon. */
  get systemData(): WeaponDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.WEAPON)
      throw new Error(`This data's data type is not ${TYPES.ITEM.WEAPON}.`);

    return this.data.data;
  }

  /** Check whether this Weapon has any SPECIAL based values. */
  hasSomeSpecialBasedValues(): boolean {
    return (
      this.hasSomeStrengthBasedAttackDamage() ||
      this.hasSomeSpecialBasedRangeDistance()
    );
  }

  override prepareBaseData(): void {
    super.prepareBaseData();
    this.systemData.attacks.attacks = {};
    Object.entries(this.systemData.attacks.sources).forEach(
      ([name, source]) =>
        (this.systemData.attacks.attacks[name] = new Attack(name, source, this))
    );
  }

  protected override validateSystemData(
    data: DeepPartial<WeaponDataSourceData>
  ): void {
    validateSystemData(data, getGame().wv.validators.item.weapon);
  }

  /** Check whether some of this Weapon's Attacks are Strength based. */
  protected hasSomeStrengthBasedAttackDamage(): boolean {
    return Object.values(this.systemData.attacks.sources).some(
      (attack) => attack.damage.diceRange
    );
  }

  /** Check whether some of this Weapon's ranges are SPECIAL based. */
  protected hasSomeSpecialBasedRangeDistance(): boolean {
    return [
      this.systemData.ranges.short?.distance,
      this.systemData.ranges.medium?.distance,
      this.systemData.ranges.long?.distance
    ].some((distance) => typeof distance === "object");
  }
}

/** A custom type guard to check whether an Item is a Weapon. */
export function isWeaponItem(item: WvItem): item is Weapon {
  return item.data.type === TYPES.ITEM.WEAPON;
}

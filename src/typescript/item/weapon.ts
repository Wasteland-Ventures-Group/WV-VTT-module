import { TYPES } from "../constants.js";
import type WeaponDataProperties from "../data/item/weapon/properties.js";
import type { Distance } from "../data/item/weapon/ranges.js";
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
      throw `The passed data's type is not ${TYPES.ITEM.WEAPON}.`;

    super(data, context);
  }

  /**
   * Get the system data of this weapon.
   */
  get systemData(): WeaponDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.WEAPON)
      throw `This data's data type is not ${TYPES.ITEM.WEAPON}.`;

    return this.data.data;
  }

  /**
   * Check whether this Weapon has any Strength based values.
   */
  hasSomeStrengthBasedValues(): boolean {
    return (
      this.hasSomeStrengthBasedAttackDamage() ||
      this.hasSomeStrengthBasedRangeDistance()
    );
  }

  /**
   * Get the effective distance for a range distance.
   * @param distance - the range distance source data
   * @returns the effective distance
   * @throws If the distance is Strength based and the Weapon has no owning
   *     Actor
   */
  getEffectiveRangeDistance(distance: Distance): number {
    if (typeof distance === "number") return distance;
    if (distance === "melee") return 0;

    if (!this.actor) throw "The Weapon has no owning Actor!";

    return (
      distance.base +
      this.actor.data.data.specials[distance.special] * distance.multiplier
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

  /**
   * Check whether some of this Weapon's Attacks are Strength based.
   */
  protected hasSomeStrengthBasedAttackDamage(): boolean {
    return Object.values(this.systemData.attacks.sources).some(
      (attack) => attack.damage.diceRange
    );
  }

  /**
   * Check whether some of this Weapon's ranges are Strength based.
   */
  protected hasSomeStrengthBasedRangeDistance(): boolean {
    const ranges = [
      this.systemData.ranges.short,
      this.systemData.ranges.medium,
      this.systemData.ranges.long
    ];

    return ranges.some(
      (range) =>
        typeof range === "object" &&
        typeof range.distance === "object" &&
        range.distance.special === "strength"
    );
  }
}

/**
 * A custom type guard to check whether an Item is a Weapon.
 */
export function isWeaponItem(item: WvItem): item is Weapon {
  return item.data.type === TYPES.ITEM.WEAPON;
}

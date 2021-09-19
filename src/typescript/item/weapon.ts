import { TYPES } from "../constants.js";
import type WeaponDataProperties from "../data/item/weapon/properties.js";
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

  override prepareBaseData(): void {
    super.prepareBaseData();
    this.systemData.attacks.attacks = {};
    Object.entries(this.systemData.attacks.sources).forEach(
      ([name, source]) =>
        (this.systemData.attacks.attacks[name] = new Attack(name, source, this))
    );
  }
}

/**
 * A custom type guard to check whether an Item is a Weapon.
 */
export function isWeaponItem(item: WvItem): item is Weapon {
  return item.data.type === TYPES.ITEM.WEAPON;
}

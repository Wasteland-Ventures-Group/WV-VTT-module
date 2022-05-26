import { TYPES } from "../constants.js";
import type WeaponDataProperties from "../data/item/weapon/properties.js";
import { WeaponDataPropertiesData } from "../data/item/weapon/properties.js";
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

  override prepareBaseData(): void {
    this.data.data = new WeaponDataPropertiesData(this.systemData, this);
  }
}

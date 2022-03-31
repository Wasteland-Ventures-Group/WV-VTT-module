import { TYPES } from "../constants.js";
import type AmmoDataProperties from "../data/item/ammo/properties.js";
import WvItem from "./wvItem.js";

/** An Item that can represent an ammo item in the Wasteland Ventures system. */
export default class Ammo extends WvItem {
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.AMMO)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.AMMO}.`);

    super(data, context);
  }

  /** Get the system data of this weapon. */
  get systemData(): AmmoDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.AMMO)
      throw new Error(`This data's data type is not ${TYPES.ITEM.AMMO}.`);

    return this.data.data;
  }
}

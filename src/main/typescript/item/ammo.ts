import { TYPES } from "../constants.js";
import { AmmoDataPropertiesData } from "../data/item/ammo/properties.js";
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

  override prepareBaseData(): void {
    this.data.data = new AmmoDataPropertiesData(this.data.data, this);
  }
}

export default interface Ammo {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.AMMO;
    _source: { type: typeof TYPES.ITEM.AMMO };
  };
}

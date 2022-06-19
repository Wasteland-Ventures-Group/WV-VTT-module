import { TYPES } from "../constants.js";
import type MagicDataProperties from "../data/item/magic/properties.js";
import { MagicDataPropertiesData } from "../data/item/magic/properties.js";
import WvItem from "./wvItem";

/** An Item that can represent a spell of any school and type. */
export default class Magic extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.MAGIC)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.MAGIC}.`);

    super(data, context);
  }

  /** Get the system data of this effect. */
  get systemData(): MagicDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.MAGIC)
      throw new Error(`This data's data type is not ${TYPES.ITEM.MAGIC}.`);

    return this.data.data;
  }

  override prepareBaseData(): void {
    this.data.data = new MagicDataPropertiesData(this.systemData, this);
  }
}

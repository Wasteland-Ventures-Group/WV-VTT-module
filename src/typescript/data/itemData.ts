import { TYPES } from "../constants.js";
import { ItemDataSourceData } from "./itemDbData.js";

export class ItemDataPropertiesData extends ItemDataSourceData {
  constructor(
    /** The value of the item in caps */
    public value: number = 0
  ) {
    super(value);
  }
}

export interface ItemDataProperties {
  type: typeof TYPES.ITEM.ITEM;
  data: ItemDataPropertiesData;
}

/** A union for the data properties of all Item types */
export type WvItemDataProperties = ItemDataProperties;

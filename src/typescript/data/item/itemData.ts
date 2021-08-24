import type { TYPES } from "../../constants.js";
import { EffectDataSourceData, ItemDataSourceData } from "./itemDbData.js";
import { Rules } from "./rules.js";

/** The Effect Item data-properties data */
export class EffectDataPropertiesData extends EffectDataSourceData {
  override rules: Rules = new Rules();
}

/** The Effect Item data-properties */
export interface EffectDataProperties {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataPropertiesData;
}

export class ItemDataPropertiesData extends ItemDataSourceData {
  override rules: Rules = new Rules();
}

export interface ItemDataProperties {
  type: typeof TYPES.ITEM.ITEM;
  data: ItemDataPropertiesData;
}

/** A union for the data properties of all Item types */
export type WvItemDataProperties = EffectDataProperties | ItemDataProperties;

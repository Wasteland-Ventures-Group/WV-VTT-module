import type { TYPES } from "../constants.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import { EffectDataSourceData, ItemDataSourceData } from "./itemDbData.js";

/** The Effect Item data-properties data */
export class EffectDataPropertiesData extends EffectDataSourceData {
  constructor(
    /** The rule elements of the effect. */
    public rules: RuleElement[] = []
  ) {
    super(rules);
  }
}

/** The Effect Item data-properties */
export interface EffectDataProperties {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataPropertiesData;
}

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
export type WvItemDataProperties = EffectDataProperties | ItemDataProperties;

import type { TYPES } from "../../constants.js";
import type RuleElement from "../../ruleEngine/ruleElement.js";
import {
  EffectDataSourceData,
  ItemDataSourceData,
  Rules as DbRules
} from "./itemDbData.js";

/** A RuleElements container, that can be used in different Items. */
export class Rules extends DbRules {
  constructor(public elements: RuleElement[] = []) {
    super();
  }
}

/** The Effect Item data-properties data */
export class EffectDataPropertiesData extends EffectDataSourceData {
  constructor(
    /** The rule elements of the effect. */
    public rules: Rules = new Rules()
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
    /** The rules of the item */
    public rules: Rules = new Rules(),

    /** The value of the item in caps */
    public value: number = 0
  ) {
    super(rules, value);
  }
}

export interface ItemDataProperties {
  type: typeof TYPES.ITEM.ITEM;
  data: ItemDataPropertiesData;
}

/** A union for the data properties of all Item types */
export type WvItemDataProperties = EffectDataProperties | ItemDataProperties;

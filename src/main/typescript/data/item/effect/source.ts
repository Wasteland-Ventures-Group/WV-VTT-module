import type { TYPES } from "../../../constants.js";
import BaseItem from "../baseItem.js";

/** The Effect Item data-source */
export default interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

/** The Effect Item data-source data */
export class EffectDataSourceData extends BaseItem {}

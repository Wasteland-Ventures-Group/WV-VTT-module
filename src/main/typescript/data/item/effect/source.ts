import type { TYPES } from "../../../constants.js";
import type { BaseItemSource } from "../common/baseItem/source.js";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";

export default interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

export type EffectDataSourceData = BaseItemSource;
export const EFFECT_SCHEMA = BASE_ITEM_SCHEMA.default({});

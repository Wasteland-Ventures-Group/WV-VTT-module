import type { TYPES } from "../../../constants.js";
import BaseItemSource, { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";
import _ = foundry.data.fields;

export default interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

export class EffectDataSourceData extends BaseItemSource {}

export const EFFECT_SCHEMA = BASE_ITEM_SCHEMA;

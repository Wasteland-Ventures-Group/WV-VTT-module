import type { TYPES } from "../../../constants.js";
import BaseItemSource from "../common/baseItem/source.js";

export default interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

export class EffectDataSourceData extends BaseItemSource {}

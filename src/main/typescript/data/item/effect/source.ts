import type { TYPES } from "../../../constants.js";
import type BaseItemSource from "../common/baseItem/source.js";

export default interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

export type EffectDataSourceData = BaseItemSource;

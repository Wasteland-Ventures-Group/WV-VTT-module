import type WvItem from "../../../item/wvItem.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import type EffectDataSource from "./source.js";
import type { EffectDataSourceData } from "./source.js";

export default interface EffectDataProperties extends EffectDataSource {
  data: EffectDataPropertiesData;
}

export type EffectDataPropertiesData = EffectDataSourceData &
  BaseItemProperties;

export const EffectDataPropertiesData = {
  transform(
    source: EffectDataSourceData,
    owningItem: WvItem
  ): EffectDataPropertiesData {
    const baseProperties = BaseItemProperties.transform(source, owningItem);
    return {
      ...baseProperties
    };
  }
};

import type WvItem from "../../../item/wvItem.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import type RaceDataSource from "./source.js";
import type {
  CreationAttributes,
  LevelingAttributes,
  PhysicalSource,
  RaceDataSourceData
} from "./source.js";

export default interface RaceDataProperties extends RaceDataSource {
  data: RaceDataPropertiesData;
}

export type RaceDataPropertiesData = RaceDataSourceData &
  BaseItemProperties & {
    physical: PhysicalSource;
    creation: CreationAttributes;
    leveling: LevelingAttributes;
  };
export const RaceDataPropertiesData = {
  transform(
    source: RaceDataSourceData,
    owningItem: WvItem
  ): RaceDataPropertiesData {
    const base = BaseItemProperties.transform(source, owningItem);
    return {
      ...source,
      ...base
    };
  }
};

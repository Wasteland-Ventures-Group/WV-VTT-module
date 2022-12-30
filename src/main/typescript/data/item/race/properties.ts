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
  from(source: RaceDataSourceData, owningItem: WvItem): RaceDataPropertiesData {
    const base = BaseItemProperties.from(source, owningItem);
    return {
      ...source,
      ...base
    };
  }
};

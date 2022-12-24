import type WvItem from "../../../item/wvItem.js";
import BaseItemProperties from "../common/baseItem/properties.js";
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

export class RaceDataPropertiesData
  extends BaseItemProperties
  implements RaceDataSourceData
{
  constructor(source: RaceDataSourceData, owningItem: WvItem) {
    super();
    BaseItemProperties.transform(this, source, owningItem);
    foundry.utils.mergeObject(this, source);
  }

  physical: PhysicalSource;

  creation: CreationAttributes;

  leveling: LevelingAttributes;
}

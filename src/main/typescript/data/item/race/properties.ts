import type WvItem from "../../../item/wvItem.js";
import BaseItemProperties from "../common/baseItem/properties.js";
import RulesProperties from "../common/rules/properties.js";
import type RaceDataSource from "./source.js";
import { RaceDataSourceData } from "./source.js";

export default interface RaceDataProperties extends RaceDataSource {
  data: RaceDataPropertiesData;
}

export class RaceDataPropertiesData
  extends RaceDataSourceData
  implements BaseItemProperties
{
  constructor(source: RaceDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    BaseItemProperties.transform(this, source, owningItem);
  }

  override rules = new RulesProperties();
}

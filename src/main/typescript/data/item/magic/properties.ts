import { MagicType, getMagicType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import BaseItemProperties from "../common/baseItem/properties.js";
import RulesProperties from "../common/rules/properties.js";
import type MagicDataSource from "./source.js";
import { MagicDataSourceData } from "./source.js";

export default interface MagicDataProperties extends MagicDataSource {
  data: MagicDataPropertiesData;
}

export class MagicDataPropertiesData
  extends MagicDataSourceData
  implements BaseItemProperties
{
  constructor(source: MagicDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    this.type = getMagicType(this.school);
    BaseItemProperties.transform(this, source, owningItem);
  }

  override rules = new RulesProperties();

  type: MagicType = getMagicType(this.school);
}

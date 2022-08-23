import { MagicType, getMagicType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import BaseItemProperties from "../common/baseItem/properties.js";
import RulesProperties from "../common/rules/properties.js";
import RangeProperties from "./ranges/properties.js";
import type MagicDataSource from "./source.js";
import { MagicDataSourceData } from "./source.js";
import { TargetProperties } from "./target/target.js";

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

    this.apCost = CompositeNumber.from(source.apCost);
    this.strainCost = CompositeNumber.from(source.strainCost);

    this.range = new RangeProperties(source.range);
    this.target = new TargetProperties(source.target);
  }

  override rules = new RulesProperties();

  override apCost: CompositeNumber;

  override strainCost: CompositeNumber;

  override range: RangeProperties;

  override target: TargetProperties;

  type: MagicType;
}

import {
  MagicType,
  getMagicType,
  GeneralMagicSchool
} from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import BaseItemProperties from "../common/baseItem/properties.js";
import RangeProperties from "./ranges/properties.js";
import type MagicDataSource from "./source.js";
import type { MagicDataSourceData } from "./source.js";
import TargetProperties from "./target/properties.js";

export default interface MagicDataProperties extends MagicDataSource {
  data: MagicDataPropertiesData;
}

export class MagicDataPropertiesData
  extends BaseItemProperties
  implements MagicDataSourceData
{
  constructor(source: MagicDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    this.school = source.school;
    this.type = getMagicType(source.school);
    BaseItemProperties.transform(this, source, owningItem);

    this.apCost = CompositeNumber.from(source.apCost);
    this.apCost.bounds.min = 0;

    this.strainCost = CompositeNumber.from(source.strainCost);
    this.strainCost.bounds.min = 0;

    this.range = new RangeProperties(source.range);
    this.target = new TargetProperties(source.target);
  }

  school: GeneralMagicSchool;

  apCost: CompositeNumber;

  strainCost: CompositeNumber;

  range: RangeProperties;

  target: TargetProperties;

  potency: CompositeNumber = new CompositeNumber();

  type: MagicType;
}

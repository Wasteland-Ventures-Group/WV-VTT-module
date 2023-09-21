import { MagicType, getMagicType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import RangeProperties from "./ranges/properties.js";
import type MagicDataSource from "./source.js";
import type { MagicDataSourceData } from "./source.js";
import TargetProperties from "./target/properties.js";

export default interface MagicDataProperties extends MagicDataSource {
  data: MagicDataPropertiesData;
}

export type MagicDataPropertiesData = MagicDataSourceData &
  BaseItemProperties & {
    apCost: CompositeNumber;
    potency: CompositeNumber;
    range: RangeProperties;
    strainCost: CompositeNumber;
    target: TargetProperties;
    type: MagicType;
  };

export const MagicDataPropertiesData = {
  from(
    source: MagicDataSourceData,
    owningItem: WvItem
  ): MagicDataPropertiesData {
    const baseProperties = BaseItemProperties.from(source, owningItem);

    const range = new RangeProperties(source.range);
    const target = new TargetProperties(source.target);
    const potency = new CompositeNumber(0, { min: 0, max: 10 });
    const apCost = CompositeNumber.from(source.apCost);
    apCost.bounds.min = 0;
    const strainCost = CompositeNumber.from(source.strainCost);
    return {
      ...source,
      ...baseProperties,
      potency,
      apCost,
      range,
      target,
      strainCost,
      type: getMagicType(source.school)
    };
  }
};

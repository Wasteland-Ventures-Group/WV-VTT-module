import { type MagicType, getMagicType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import { RangeProperties } from "./ranges/properties.js";
import { MAGIC_SCHEMA } from "./source.js";
import { type TargetProperties } from "./target/properties.js";
import fields = foundry.data.fields

export type MagicSource = fields.SchemaField.InitializedData<typeof MAGIC_SCHEMA>;
export type MagicProperties = MagicSource & BaseItemProperties & {
  type: MagicType;
  potency: CompositeNumber;
  target: TargetProperties;
  range: RangeProperties;
  apCost: CompositeNumber;
  strainCost: CompositeNumber;
};

export namespace MagicProperties {
  export function from(s: MagicSource, owningItem: WvItem): MagicProperties {
    const apCost = CompositeNumber.from(s.apCost);
    apCost.bounds.min = 0;
    const strainCost = CompositeNumber.from(s.strainCost);
    strainCost.bounds.min = 0;
    return {
      ...s,
      ...BaseItemProperties.from(s, owningItem),
      type: getMagicType(s.school),
      range: RangeProperties.from(s.range),
      potency: new CompositeNumber(),
      apCost,
      strainCost,
    }
  }
}

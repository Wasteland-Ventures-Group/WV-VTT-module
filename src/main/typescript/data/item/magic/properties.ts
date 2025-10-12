import { type MagicType, getMagicType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import RangeProperties from "./ranges/properties.js";
import type MagicDataSource from "./source.js";
import { MAGIC_SCHEMA, MagicDataSourceData } from "./source.js";
import TargetProperties from "./target/properties.js";
import fields = foundry.data.fields

export type MagicSource = fields.SchemaField.InitializedData<typeof MAGIC_SCHEMA>;
export type MagicProperties = MagicSource & BaseItemProperties;
export namespace MagicProperties {
  export function from(s: MagicSource, owningItem: WvItem): MagicProperties {
    return {
      ...s,
      ...BaseItemProperties.from(s, owningItem),
    }
  }
}

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
    this.apCost.bounds.min = 0;

    this.strainCost = CompositeNumber.from(source.strainCost);
    this.strainCost.bounds.min = 0;

    this.range = new RangeProperties(source.range);
    this.target = new TargetProperties(source.target);
  }

  override rules = new RulesProperties();

  override apCost: CompositeNumber;

  override strainCost: CompositeNumber;

  override range: RangeProperties;

  override target: TargetProperties;

  potency: CompositeNumber = new CompositeNumber();

  type: MagicType;
}

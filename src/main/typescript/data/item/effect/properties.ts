import type WvItem from "../../../item/wvItem.js";
import BaseItemProperties from "../common/baseItem/properties.js";
import type EffectDataSource from "./source.js";
import type { EffectDataSourceData } from "./source.js";

export default interface EffectDataProperties extends EffectDataSource {
  data: EffectDataPropertiesData;
}

export class EffectDataPropertiesData
  extends BaseItemProperties
  implements EffectDataSourceData
{
  constructor(source: EffectDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    BaseItemProperties.transform(this, source, owningItem);
  }
}

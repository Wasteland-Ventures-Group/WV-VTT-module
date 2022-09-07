import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import RulesProperties from "../common/rules/properties.js";
import StackableItemProperties from "../common/stackableItem/properties.js";
import type MiscDataSource from "./source.js";
import { MiscDataSourceData } from "./source.js";

export default interface MiscDataProperties extends MiscDataSource {
  data: MiscDataPropertiesData;
}

export class MiscDataPropertiesData
  extends MiscDataSourceData
  implements StackableItemProperties
{
  constructor(source: MiscDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    StackableItemProperties.transform(this, source, owningItem);
  }

  override rules = new RulesProperties();

  override value = new CompositeNumber();

  override weight = new CompositeNumber();
}

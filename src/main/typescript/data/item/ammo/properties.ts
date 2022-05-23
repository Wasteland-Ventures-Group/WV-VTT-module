import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import RulesProperties from "../common/rules/properties.js";
import StackableItemProperties from "../common/stackableItem/properties.js";
import type AmmoDataSource from "./source.js";
import { AmmoDataSourceData } from "./source.js";

export default interface AmmoDataProperties extends AmmoDataSource {
  data: AmmoDataPropertiesData;
}

export class AmmoDataPropertiesData
  extends AmmoDataSourceData
  implements StackableItemProperties
{
  constructor(source: AmmoDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    StackableItemProperties.transform(this, source, owningItem);
  }

  override rules = new RulesProperties();

  override value = new CompositeNumber();

  override weight = new CompositeNumber();
}

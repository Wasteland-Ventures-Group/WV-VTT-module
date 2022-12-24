import type { Caliber } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import StackableItemProperties from "../common/stackableItem/properties.js";
import type AmmoDataSource from "./source.js";
import type { AmmoDataSourceData } from "./source.js";

export default interface AmmoDataProperties extends AmmoDataSource {
  data: AmmoDataPropertiesData;
}

export class AmmoDataPropertiesData
  extends StackableItemProperties
  implements AmmoDataSourceData
{
  constructor(source: AmmoDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    StackableItemProperties.transform(this, source, owningItem);
  }

  type: string;

  caliber: Caliber;
}

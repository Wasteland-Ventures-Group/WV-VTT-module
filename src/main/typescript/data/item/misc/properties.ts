import type WvItem from "../../../item/wvItem.js";
import StackableItemProperties from "../common/stackableItem/properties.js";
import type MiscDataSource from "./source.js";
import type { MiscDataSourceData } from "./source.js";

export default interface MiscDataProperties extends MiscDataSource {
  data: MiscDataPropertiesData;
}

export class MiscDataPropertiesData
  extends StackableItemProperties
  implements MiscDataSourceData
{
  constructor(source: MiscDataSourceData, owningItem: WvItem) {
    super();
    StackableItemProperties.transform(this, source, owningItem);
    foundry.utils.mergeObject(this, source);
  }
}

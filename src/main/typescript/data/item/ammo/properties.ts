import type WvItem from "../../../item/wvItem.js";
import { StackableItemProperties } from "../common/stackableItem/properties.js";
import type AmmoDataSource from "./source.js";
import type { AmmoDataSourceData } from "./source.js";

export default interface AmmoDataProperties extends AmmoDataSource {
  data: AmmoDataPropertiesData;
}

export type AmmoDataPropertiesData = AmmoDataSourceData &
  StackableItemProperties;
export const AmmoDataPropertiesData = {
  from(source: AmmoDataSourceData, owningItem: WvItem): AmmoDataPropertiesData {
    const baseProperties = StackableItemProperties.from(source, owningItem);
    return {
      ...source,
      ...baseProperties
    };
  }
};

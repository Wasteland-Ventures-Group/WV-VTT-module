import type WvItem from "../../../item/wvItem.js";
import { StackableItemProperties } from "../common/stackableItem/properties.js";
import type MiscDataSource from "./source.js";
import type { MiscDataSourceData } from "./source.js";

export default interface MiscDataProperties extends MiscDataSource {
  data: MiscDataPropertiesData;
}

export type MiscDataPropertiesData = MiscDataSourceData &
  StackableItemProperties;

export const MiscDataPropertiesData = {
  from(source: MiscDataSourceData, owningItem: WvItem): MiscDataPropertiesData {
    return {
      ...source,
      ...StackableItemProperties.from(source, owningItem)
    };
  }
};

import type { StackableItemProperties } from "../common/stackableItem/properties.js";
import type MiscDataSource from "./source.js";
import type { MiscDataSourceData } from "./source.js";

export default interface MiscDataProperties extends MiscDataSource {
  data: MiscDataPropertiesData;
}

export type MiscDataPropertiesData = MiscDataSourceData &
  StackableItemProperties;

import type { TYPES } from "../../../constants.js";
import type StackableItem from "../common/stackableItem/source.js";
import { STACK_ITEM_SOURCE_SCHEMA } from "../common/stackableItem/source.js";

export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

export type MiscDataSourceData = StackableItem;
export const MISC_SCHEMA = STACK_ITEM_SOURCE_SCHEMA;

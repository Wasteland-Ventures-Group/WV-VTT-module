import type { TYPES } from "../../../constants.js";
import type { StackableItemSource } from "../common/stackableItem/source.js";
import { STACK_ITEM_SCHEMA } from "../common/stackableItem/source.js";

export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

export type MiscDataSourceData = StackableItemSource;
export const MISC_SCHEMA = STACK_ITEM_SCHEMA;

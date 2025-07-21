import type { TYPES } from "../../../constants.js";
import StackableItem, { STACKABLE_ITEM_SCHEMA } from "../common/stackableItem/source.js";
import _ = foundry.data.fields;

export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

export class MiscDataSourceData extends StackableItem {}
export const MISC_SCHEMA = STACKABLE_ITEM_SCHEMA;

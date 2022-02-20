import type { TYPES } from "../../../constants.js";
import StackableBaseItem from "../stackableBaseItem.js";

/** The Miscellaneous Item data-source */
export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

/** The Miscellaneous Item data-source data */
export class MiscDataSourceData extends StackableBaseItem {}

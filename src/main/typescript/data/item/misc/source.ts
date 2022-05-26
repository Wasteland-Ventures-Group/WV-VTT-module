import type { TYPES } from "../../../constants.js";
import StackableItem from "../common/stackableItem/source.js";

export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

export class MiscDataSourceData extends StackableItem {}

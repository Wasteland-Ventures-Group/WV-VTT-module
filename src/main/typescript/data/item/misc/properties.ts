import Rules from "../rules/properties.js";
import MiscDataSource, { MiscDataSourceData } from "./source.js";

/** The Miscellaneous Item data-properties */
export default interface MiscDataProperties extends MiscDataSource {
  data: MiscDataPropertiesData;
}

/** The Miscellaneous Item data-properties data */
class MiscDataPropertiesData extends MiscDataSourceData {
  override rules: Rules = new Rules();
}

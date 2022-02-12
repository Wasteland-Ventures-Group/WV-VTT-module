import Rules from "../rules/properties.js";
import type AmmoDataSource from "./source.js";
import { AmmoDataSourceData } from "./source.js";

/** The Ammo Item data-properties */
export default interface AmmoDataProperties extends AmmoDataSource {
  data: AmmoDataPropertiesData;
}

/** The Ammo Item data-properties data */
class AmmoDataPropertiesData extends AmmoDataSourceData {
  override rules: Rules = new Rules();
}

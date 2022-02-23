import Rules from "../rules/properties.js";
import type ApparelDataSource from "./source.js";
import { ApparelDataSourceData } from "./source.js";

/** The Apparel Item data-properties */
export default interface ApparelDataProperties extends ApparelDataSource {
  data: ApparelDataPropertiesData;
}

/** The Apparel Item data-properties data */
class ApparelDataPropertiesData extends ApparelDataSourceData {
  override rules: Rules = new Rules();
}

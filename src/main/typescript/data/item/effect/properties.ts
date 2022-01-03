import { Rules } from "../rules/properties.js";
import EffectDataSource, { EffectDataSourceData } from "./source.js";

/** The Effect Item data-properties */
export default interface EffectDataProperties extends EffectDataSource {
  data: EffectDataPropertiesData;
}

/** The Effect Item data-properties data */
class EffectDataPropertiesData extends EffectDataSourceData {
  override rules: Rules = new Rules();
}

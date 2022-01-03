import { Rules } from "../rules/properties.js";
import { Attacks } from "./attack/properties.js";
import WeaponDataSource, { WeaponDataSourceData } from "./source.js";

/** The Weapon Item data-properties */
export default interface WeaponDataProperties extends WeaponDataSource {
  data: WeaponDataPropertiesData;
}

/** The Weapon Item data-properties data */
class WeaponDataPropertiesData extends WeaponDataSourceData {
  override attacks: Attacks = new Attacks();

  override rules: Rules = new Rules();
}

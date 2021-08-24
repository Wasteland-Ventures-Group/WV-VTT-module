import type { TYPES } from "../../constants.js";
import { EffectDataSourceData } from "./itemDbData.js";
import { RangedWeaponDataSourceData } from "./physicalItemDbData.js";
import { Rules } from "./rules.js";

/** The Effect Item data-properties data */
export class EffectDataPropertiesData extends EffectDataSourceData {
  override rules: Rules = new Rules();
}

/** The Effect Item data-properties */
export interface EffectDataProperties {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataPropertiesData;
}

/** The RangedWeapon Item data-properties data */
export class RangedWeaponDataPropertiesData extends RangedWeaponDataSourceData {
  override rules: Rules = new Rules();
}

/** The RangedWeapon Item data-properties */
export interface RangedWeaponDataProperties {
  type: typeof TYPES.ITEM.RANGED_WEAPON;
  data: RangedWeaponDataPropertiesData;
}

/** A union for the data properties of all Item types */
export type WvItemDataProperties =
  | EffectDataProperties
  | RangedWeaponDataProperties;

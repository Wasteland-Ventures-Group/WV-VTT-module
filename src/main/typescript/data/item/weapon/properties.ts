import type Weapon from "../../../item/weapon.js";
import { CompositeNumber } from "../../common.js";
import { PhysicalItemProperties } from "../common/physicalItem/properties.js";
import { AttacksProperties } from "./attack/properties.js";
import { RangesProperties } from "./ranges/properties.js";
import { ReloadProperties } from "./reload/properties.js";
import type WeaponDataSource from "./source.js";
import type { WeaponDataSourceData } from "./source.js";

export default interface WeaponDataProperties extends WeaponDataSource {
  data: WeaponDataPropertiesData;
}

export type WeaponDataPropertiesData = WeaponDataSourceData &
  PhysicalItemProperties & {
    attacks: AttacksProperties;
    ranges: RangesProperties;
    reload: ReloadProperties;
    strengthRequirement: CompositeNumber;
  };
export const WeaponDataPropertiesData = {
  from(
    source: WeaponDataSourceData,
    owningWeapon: Weapon
  ): WeaponDataPropertiesData {
    const baseProperties = PhysicalItemProperties.transform(
      source,
      owningWeapon
    );
    const attacks = AttacksProperties.transform(source.attacks, owningWeapon);
    const ranges = RangesProperties.transform(source.ranges);
    const reload = ReloadProperties.transform(source.reload);

    const strengthRequirement = CompositeNumber.from(
      source.strengthRequirement
    );
    strengthRequirement.bounds = { min: 0, max: 15 };
    return {
      ...source,
      ...baseProperties,
      attacks,
      ranges,
      reload,
      strengthRequirement
    };
  }
};

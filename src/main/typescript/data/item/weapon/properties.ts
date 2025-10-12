import type Weapon from "../../../item/weapon.js";
import { CompositeNumber } from "../../common.js";
import { PhysicalItemProperties } from "../common/physicalItem/properties.js";
import AttacksProperties from "./attack/properties.js";
import RangesProperties from "./ranges/properties.js";
import ReloadProperties from "./reload/properties.js";
import { WeaponDataSourceData, type WeaponSource } from "./source.js";
import fields = foundry.data.fields;
import type WvItem from "../../../item/wvItem.js";

export type WeaponProperties = WeaponSource & PhysicalItemProperties & {};

// export default interface WeaponDataProperties extends WeaponDataSource {
//   data: WeaponDataPropertiesData;
// }

// export class WeaponDataPropertiesData
//   extends WeaponDataSourceData
//   implements PhysicalItemProperties {
//   constructor(source: WeaponDataSourceData, owningWeapon: Weapon) {
//     super();
//     foundry.utils.mergeObject(this, source);
//     PhysicalItemProperties.transform(this, source, owningWeapon);
//     this.attacks = new AttacksProperties(source.attacks, owningWeapon);
//     this.ranges = new RangesProperties(source.ranges);
//     this.reload = new ReloadProperties(source.reload);
//
//     this.strengthRequirement = CompositeNumber.from(source.strengthRequirement);
//     this.strengthRequirement.bounds = { min: 0, max: 15 };
//   }
//
//   override rules = new RulesProperties();
//
//   override value = new CompositeNumber();
//
//   override weight = new CompositeNumber();
//
//   override attacks: AttacksProperties;
//
//   override ranges: RangesProperties;
//
//   override reload: ReloadProperties;
//
//   override strengthRequirement: CompositeNumber;
// }

export namespace WeaponProperties {
  export function from(s: WeaponSource, owningItem: WvItem) {
    return {
      ...s,
      ...PhysicalItemProperties.from(s, owningItem),
    }
  }
}

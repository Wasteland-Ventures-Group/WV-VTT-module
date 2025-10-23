import { PhysicalItemProperties } from "../common/physicalItem/properties.js";
import { AttacksProperties } from "./attack/properties.js";
import RangesProperties from "./ranges/properties.js";
import ReloadProperties from "./reload/properties.js";
import { WEAPON_SCHEMA } from "./source.js";
import type WvItem from "../../../item/wvItem.js";
import type WvActor from "../../../actor/wvActor.js";
import { TAGS } from "../../../constants.js";
import fields = foundry.data.fields;
import { CompositeNumber } from "../../common.js";

type WeaponSource = fields.SchemaField.InitializedData<typeof WEAPON_SCHEMA>;
export type WeaponProperties = WeaponSource & PhysicalItemProperties & {
  ranges: RangesProperties,
  attacks: AttacksProperties,
  reload: ReloadProperties,
  strengthRequirement: CompositeNumber,
};

export namespace WeaponProperties {
  export function applySizeCategoryReachBonus(ranges: RangesProperties, actor: WvActor | null) {
    if (!actor) return;

    ranges.getMatching([TAGS.sizeCategoryReachBonus]).forEach((range) =>
      range.distance.applySizeCategoryReachBonus(
        actor.system.background.size.total
      )
    );
  }
}

export namespace WeaponProperties {
  export function from(s: WeaponSource, owningWeapon: WvItem<"weapon">): WeaponProperties {
    return {
      ...s,
      ...PhysicalItemProperties.from(s, owningWeapon),
      attacks: AttacksProperties.from(s.attacks, owningWeapon),
      reload: new ReloadProperties(s.reload),
      strengthRequirement: CompositeNumber.from(s.strengthRequirement),
      ranges: new RangesProperties(s.ranges),
    }
  }
}

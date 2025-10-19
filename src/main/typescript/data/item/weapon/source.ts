import { type SkillName, SkillNames, TYPES } from "../../../constants.js";
import { type CompositeNumberSource } from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { PHYS_ITEM_SCHEMA, } from "../common/physicalItem/source.js";
import AttacksSource from "./attack/source.js";

import fields = foundry.data.fields;

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

class WeaponDataSourceData {
  /** The attacks of the weapon */
  attacks: AttacksSource = new AttacksSource();

  /** Whether the weapon is a holdout weapon */
  holdout?: boolean = false;

  /** The reload of the weapon */
  // reload: ReloadSource = RELOAD_JSON_SCHEMA.default;

  skill: SkillName = "firearms";

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: CompositeNumberSource = { source: 0 };
}

const RANGES_SCHEMA = {

}

export const WEAPON_SCHEMA = {
  /** The skill associated with the weapon attacks */
  skill: new fields.StringField({ choices: SkillNames }),
  /** The ranges of the weapon */
  ranges: new fields.SchemaField(RANGES_SCHEMA),
  ...PHYS_ITEM_SCHEMA
}

export type WeaponSource = fields.SchemaField.InitializedData<typeof WEAPON_SCHEMA>;


export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: typeof TYPES.ITEM.WEAPON;
}


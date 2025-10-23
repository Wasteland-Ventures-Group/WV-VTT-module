import { type SkillName, SkillNames, TYPES } from "../../../constants.js";
import { CompositeNumberField } from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { PHYS_ITEM_SCHEMA, } from "../common/physicalItem/source.js";

import fields = foundry.data.fields;
import { ATTACK_SCHEMA } from "./attack/source.js";
import { RELOAD_SCHEMA } from "./reload/source.js";
import { RANGES_SCHEMA } from "./ranges/source.js";

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

class WeaponDataSourceData {
  /** Whether the weapon is a holdout weapon */
  holdout?: boolean = false;

  /** The reload of the weapon */
  // reload: ReloadSource = RELOAD_JSON_SCHEMA.default;

  skill: SkillName = "firearms";
}

export const WEAPON_SCHEMA = {
  /** The skill associated with the weapon attacks */
  skill: new fields.StringField({ choices: SkillNames }),
  /** The ranges of the weapon */
  ranges: new fields.SchemaField(RANGES_SCHEMA),
  /** Information regarding the weapon's ammunition and reloading. */
  reload: new fields.SchemaField(RELOAD_SCHEMA),
  /** The attacks of the weapon */
  attacks: new fields.ArrayField(new fields.SchemaField(ATTACK_SCHEMA), { required: true }),
  /** The weapon's strength requirement */
  strengthRequirement: CompositeNumberField.create({ min: 0, initial: 0 }),
  ...PHYS_ITEM_SCHEMA
}



export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: typeof TYPES.ITEM.WEAPON;
}


import type { JSONSchemaType } from "ajv";
import { type SkillName, SkillNames, TYPES } from "../../../constants.js";
import {
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { COMPENDIUM_JSON_SCHEMA } from "../../foundryCommon.js";
import { type PhysicalItemSource, PHYS_ITEM_SCHEMA, } from "../common/physicalItem/source.js";
import AttacksSource, { ATTACK_JSON_SCHEMA } from "./attack/source.js";
import type RangesSource from "./ranges/source.js";
import { RANGES_JSON_SCHEMA } from "./ranges/source.js";
import type ReloadSource from "./reload/source.js";
import { RELOAD_JSON_SCHEMA } from "./reload/source.js";

import fields = foundry.data.fields;

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

export class WeaponDataSourceData extends PhysicalItemSource {
  /** The attacks of the weapon */
  attacks: AttacksSource = new AttacksSource();

  /** Whether the weapon is a holdout weapon */
  holdout?: boolean = false;

  /** The ranges of the weapon */
  ranges: RangesSource = RANGES_JSON_SCHEMA.default;

  /** The reload of the weapon */
  reload: ReloadSource = RELOAD_JSON_SCHEMA.default;

  skill: SkillName = "firearms";

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: CompositeNumberSource = { source: 0 };
}

export const WEAPON_SCHEMA = {
  /** The skill associated with the weapon attacks */
  skill: new fields.StringField({ choices: SkillNames }),
  ...PHYS_ITEM_SCHEMA
}

export type WeaponSource = fields.SchemaField.InitializedData<typeof WEAPON_SCHEMA>;


export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: typeof TYPES.ITEM.WEAPON;
}


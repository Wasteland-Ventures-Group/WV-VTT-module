import { z } from "zod";
import { SkillNames, TYPES } from "../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { PHYSICAL_SOURCE_SCHEMA } from "../race/source.js";
import { ATTACK_SCHEMA } from "./attack/source.js";
import { RANGES_SCHEMA } from "./ranges/source.js";
import { RELOAD_SCHEMA } from "./reload/source.js";

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

export type WeaponDataSourceData = z.infer<typeof WEAPON_SCHEMA>;
export const WEAPON_SCHEMA = PHYSICAL_SOURCE_SCHEMA.extend({
  /** The attacks of the weapon */
  attacks: ATTACK_SCHEMA,

  /** Whether the weapon is a holdout weapon */
  holdout: z.boolean().default(false),

  /** The ranges of the weapon */
  ranges: RANGES_SCHEMA.default({}),

  /** The reload of the weapon */
  reload: RELOAD_SCHEMA.default({}),

  /** The skill associated with the weapon attacks */
  skill: z.enum(SkillNames).default("firearms"),

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: COMP_NUM_SCHEMA.default({})
});

export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: typeof TYPES.ITEM.WEAPON;
}

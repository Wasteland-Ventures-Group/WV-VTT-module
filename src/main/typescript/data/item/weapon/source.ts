import { z } from "zod";
import { SkillNames, TYPES } from "../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../common.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { PHYS_ITEM_SOURCE_SCHEMA } from "../common/physicalItem/source.js";
import { ATTACKS_SOURCE_SCHEMA } from "./attack/source.js";
import { RANGES_SOURCE_SCHEMA } from "./ranges/source.js";
import { RELOAD_SOURCE_SCHEMA } from "./reload/source.js";

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

export type WeaponDataSourceData = z.infer<typeof WEAPON_SOURCE_SCHEMA>;
export const WEAPON_SOURCE_SCHEMA = PHYS_ITEM_SOURCE_SCHEMA.extend({
  /** The attacks of the weapon */
  attacks: ATTACKS_SOURCE_SCHEMA.default({ sources: {} }).describe(
    "The attacks of the weapon"
  ),

  /** Whether the weapon is a holdout weapon */
  holdout: z
    .boolean()
    .default(false)
    .describe("Whether the weapon is a holdout weapon"),

  /** The ranges of the weapon */
  ranges: RANGES_SOURCE_SCHEMA.default({}).describe("The ranges of the weapon"),

  /** The reload of the weapon */
  reload: RELOAD_SOURCE_SCHEMA.default({}).describe("The reload of the weapon"),

  /** The skill associated with the weapon attacks */
  skill: z
    .enum(SkillNames)
    .default("firearms")
    .describe("The skill associated with the weapon attacks"),

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The strength requirement for this weapon to be equipped"
  )
}).default({});

export const COMP_WEAPON_SCHEMA = compDataZodSchema(
  WEAPON_SOURCE_SCHEMA,
  "weapon",
  "icons/weapons/guns/gun-pistol-flintlock-white.webp",
  "New Weapon"
);

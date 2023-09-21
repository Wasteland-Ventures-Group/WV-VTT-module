import { z } from "zod";
import { SplashSizes } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../../common.js";

export type DamageFallOffType = typeof DamageFallOffTypes[number];
const DamageFallOffTypes = ["shotgun"] as const;

/** The source data for weapon damage */
export type DamageSource = z.infer<typeof DAMAGE_SOURCE_SCHEMA>;
export const DAMAGE_SOURCE_SCHEMA = z.object({
  /** The base damage amount */
  base: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The base damage amount"
  ),

  /** The number of d6 to throw for variable damage */
  dice: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The number of d6 to throw for variable damage"
  ),

  /** Whether the damage uses a dice range based on actor Strength */
  diceRange: z
    .boolean()
    .optional()
    .describe("Whether the damage uses a dice range based on actor Strength"),

  /** The optional damage fall-off type of the attack */
  damageFallOff: z
    .union([z.enum(DamageFallOffTypes), z.literal("")])
    .optional()
    .describe("The optional damage fall-off type of the attack")
});

/** The source scheme for a single attack */
export type AttackSource = z.infer<typeof ATTACK_SOURCE_SCHEMA>;
export const ATTACK_SOURCE_SCHEMA = z
  .object({
    /** The values related to the damage the weapon causes */
    damage: DAMAGE_SOURCE_SCHEMA.default({}).describe(
      "The values related to the damage the weapon causes"
    ),

    /** The amount of rounds used with the attack */
    rounds: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({})
      .optional()
      .describe("The amount of rounds used with the attack"),

    /** The damage threshold reduction of the attack */
    dtReduction: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({})
      .optional()
      .describe("The damage threshold reduction of the attack"),

    /** The splash radius */
    splash: z.enum(SplashSizes).optional().describe("The splash radius"),

    /** The amount of action points needed to attack */
    ap: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().describe(
      "The amount of action points needed to attack"
    ),

    /** Tags of the attack */
    tags: z.array(z.string()).default([]).describe("Tags of the attack")
  })
  .default({});

/** The source schema for multiple attacks */
export type AttacksSource = z.infer<typeof ATTACKS_SOURCE_SCHEMA>;
export const ATTACKS_SOURCE_SCHEMA = z.object({
  sources: z.record(ATTACK_SOURCE_SCHEMA)
});

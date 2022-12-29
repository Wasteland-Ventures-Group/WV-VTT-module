import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { SplashSizes } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";

export type AttacksSource = z.infer<typeof ATTACKS_SCHEMA>;
export type AttackSource = z.infer<typeof ATTACK_SCHEMA>;
export type DamageSource = z.infer<typeof DAMAGE_SCHEMA>;

export type DamageFallOffType = typeof DamageFallOffTypes[number];
const DamageFallOffTypes = ["shotgun"] as const;

/** The source data for weapon damage */
export const DAMAGE_SCHEMA = z.object({
  /** The base damage amount */
  base: COMP_NUM_SCHEMA.default({}),

  /** The number of d6 to throw for variable damage */
  dice: COMP_NUM_SCHEMA.default({}),

  /** Whether the damage uses a dice range based on actor Strength */
  diceRange: z.boolean().optional(),

  /** The optional damage fall-off type of the attack */
  damageFallOff: z.union([z.enum(DamageFallOffTypes), z.literal("")]).optional()
});

export const ATTACK_SCHEMA = z.object({
  /** The values related to the damage the weapon causes */
  damage: DAMAGE_SCHEMA,

  /** The amount of rounds used with the attack */
  rounds: COMP_NUM_SCHEMA.default({}).optional(),

  /** The damage threshold reduction of the attack */
  dtReduction: COMP_NUM_SCHEMA.default({}).optional(),

  /** The splash radius */
  splash: z.enum(SplashSizes).optional(),

  /** The amount of action points needed to attack */
  ap: COMP_NUM_SCHEMA.optional(),

  /** Tags of the attack */
  tags: z.array(z.string()).default([])
});

export const ATTACKS_SCHEMA = z.object({ sources: z.record(ATTACK_SCHEMA) });

export const ATTACK_JSON_SCHEMA = zodToJsonSchema(ATTACK_SCHEMA);

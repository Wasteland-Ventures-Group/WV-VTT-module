import { z } from "zod";
import { CONSTANTS, SkillNames, SpecialNames } from "../../../../constants.js";
import { fullRecordWithDefault, zObject } from "../../../common.js";

export const SKILL_RANKS_SCHEMA = fullRecordWithDefault(
  SkillNames,
  z.number(),
  CONSTANTS.bounds.skills.points.min
);

export const SPECIAL_POINTS_SCHEMA = fullRecordWithDefault(
  SpecialNames,
  z.number(),
  5
);

export const LEVELING_SOURCE_SCHEMA = zObject({
  /** The current experience of the character */
  experience: z.number().default(0),

  /**
   * The skill point relevant intelligence values at each level up of the
   * character
   */
  levelIntelligences: z.number().array().default([]),

  /** The skill ranks of the character */
  skillRanks: SKILL_RANKS_SCHEMA,

  /** The SPECIAL points of the character */
  specialPoints: SPECIAL_POINTS_SCHEMA
});

export type LevelingSource = z.infer<typeof LEVELING_SOURCE_SCHEMA>;

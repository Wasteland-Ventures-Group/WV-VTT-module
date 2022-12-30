import { z } from "zod";
import { SpellRanges, SplashSizes } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";

export type RangeSource = z.infer<typeof RANGE_SCHEMA>;

export const RANGE_SCHEMA = z
  .object({
    /** The type of range */
    type: z.enum(SpellRanges).default("none"),
    /** How the distance scales with potency */
    distanceScale: COMP_NUM_SCHEMA.default({}),
    /** The base value for the distance */
    distanceBase: COMP_NUM_SCHEMA.default({}),
    /** The splash in which the spell can be cast */
    splashSize: z.enum(SplashSizes).default("tiny"),
    /** An in-depth description of the range */
    description: z.string().default("")
  })
  .default({});

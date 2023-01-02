import { z } from "zod";
import { SpellRanges, SplashSizes } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SCHEMA } from "../../../common.js";

export type RangeSource = z.infer<typeof RANGE_SCHEMA>;

export const RANGE_SCHEMA = z
  .object({
    /** The type of range */
    type: z.enum(SpellRanges).default("none").describe("The type of range"),

    /** How the distance scales with potency */
    distanceScale: COMPOSITE_NUMBER_SCHEMA.default({}).describe(
      "How the distance scales with potency"
    ),

    /** The base value for the distance */
    distanceBase: COMPOSITE_NUMBER_SCHEMA.default({}).describe(
      "The base value for the distance"
    ),

    /** The splash in which the spell can be cast */
    splashSize: z
      .enum(SplashSizes)
      .default("tiny")
      .describe("The splash in which the spell can be cast"),

    /** An in-depth description of the range */
    description: z
      .string()
      .default("")
      .describe("An in-depth description of the range")
  })
  .default({});

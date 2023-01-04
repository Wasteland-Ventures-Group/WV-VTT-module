import { z } from "zod";
import { SpecialNames } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA, zObject } from "../../../common.js";

export type RangeSource = z.infer<typeof RANGE_SOURCE_SCHEMA>;
export type RangesSource = z.infer<typeof RANGES_SOURCE_SCHEMA>;
export type DistanceSource = z.infer<typeof DISTANCE_SOURCE_SCHEMA>;

/** The schema representing distance information */
export const DISTANCE_SOURCE_SCHEMA = zObject({
  /** The base distance of the range distance in meters */
  base: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The base distance of the range distance in meters"
  ),

  /** The SPECIAL multiplier of the range distance */
  multiplier: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The SPECIAL multiplier of the range distance"
  ),

  /** The name of the SPECIAL to use for the range distance */
  special: z
    .union([z.enum(SpecialNames), z.literal("")])
    .default("")
    .describe("The name of the SPECIAL to use for the range distance")
});

/** The schema representing range information */
export const RANGE_SOURCE_SCHEMA = zObject({
  /** The distance of the range */
  distance: DISTANCE_SOURCE_SCHEMA.default({}).describe(
    "The distance of the range"
  ),

  /** The skill check modifier associated with this range */
  modifier: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The skill check modifier associated with this range"
  ),

  /** Tags of the range */
  tags: z.array(z.string()).default([]).describe("Tags of the range")
});

/** A schema representing the three WV range categories */
export const RANGES_SOURCE_SCHEMA = zObject({
  /** The short range of the weapon */
  short: RANGE_SOURCE_SCHEMA.default({}).describe(
    "The short range of the weapon"
  ),

  /** The medium range of the weapon */
  medium: RANGE_SOURCE_SCHEMA.default({}).describe(
    "The medium range of the weapon"
  ),

  /** The long range of the weapon */
  long: RANGE_SOURCE_SCHEMA.default({}).describe("The long range of the weapon")
});

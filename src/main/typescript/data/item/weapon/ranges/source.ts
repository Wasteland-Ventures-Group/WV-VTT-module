import { z } from "zod";
import { SpecialNames } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";

export type RangeSource = z.infer<typeof RANGE_SCHEMA>;
export type RangesSource = z.infer<typeof RANGES_SCHEMA>;
export type DistanceSource = z.infer<typeof DISTANCE_SCHEMA>;

/** The schema representing distance information */
export const DISTANCE_SCHEMA = z.object({
  /** The base distance of the range distance in meters */
  base: COMP_NUM_SCHEMA.default({}),

  /** The SPECIAL multiplier of the range distance */
  multiplier: COMP_NUM_SCHEMA.default({}),

  /** The name of the SPECIAL to use for the range distance */
  special: z.union([z.enum(SpecialNames), z.literal("")]).default("")
});

/** The schema representing range information */
export const RANGE_SCHEMA = z.object({
  /** The distance of the range */
  distance: DISTANCE_SCHEMA.default({}),

  /** The skill check modifier associated with this range */
  modifier: COMP_NUM_SCHEMA.default({}),

  /** Tags of the range */
  tags: z.array(z.string()).default([])
});

/** A schema representing the three WV range categories */
export const RANGES_SCHEMA = z.object({
  /** The short range of the weapon */
  short: RANGE_SCHEMA.default({}),

  /** The medium range of the weapon */
  medium: RANGE_SCHEMA.default({}),

  /** The long range of the weapon */
  long: RANGE_SCHEMA.default({})
});

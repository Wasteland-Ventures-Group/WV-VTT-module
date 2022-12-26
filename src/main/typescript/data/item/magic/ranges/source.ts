import { z } from "zod";
import { SpellRanges, SplashSizes } from "../../../../constants.js";
import { CompositeNumberSchema } from "../../../common.js";

export type RangeSource = z.infer<typeof RANGE_SCHEMA>;

export const RANGE_SCHEMA = z
  .object({
    type: z.enum(SpellRanges).default("none"),
    distanceScale: CompositeNumberSchema,
    distanceBase: CompositeNumberSchema,
    splashSize: z.enum(SplashSizes).default("tiny"),
    description: z.string().default("")
  })
  .default({});

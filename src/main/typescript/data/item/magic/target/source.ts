import { z } from "zod";
import { SplashSizes, TargetTypes } from "../../../../constants.js";
import { CompositeNumberSchema } from "../../../common.js";

export const AOETypes = ["none", "fixed", "varies"] as const;

export const TargetSchema = z
  .object({
    type: z.enum(TargetTypes).default("none"),
    count: CompositeNumberSchema,
    aoeType: z.enum(AOETypes).default("none"),
    fixedAoE: z.enum(SplashSizes).default("tiny")
  })
  .default({});

export interface TargetSource extends z.infer<typeof TargetSchema> {};

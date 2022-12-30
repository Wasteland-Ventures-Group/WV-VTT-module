import { z } from "zod";
import { SplashSizes, TargetTypes } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";

export const AOETypes = ["none", "fixed", "varies"] as const;

export const TARGET_SCHEMA = z
  .object({
    type: z.enum(TargetTypes).default("none"),
    count: COMP_NUM_SCHEMA.default({}),
    aoeType: z.enum(AOETypes).default("none"),
    fixedAoE: z.enum(SplashSizes).default("tiny")
  })
  .default({});

export type TargetSource = z.infer<typeof TARGET_SCHEMA>;

import { z } from "zod";
import { SplashSizes, TargetTypes } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";

export const AOETypes = ["none", "fixed", "varies"] as const;

export const TARGET_SCHEMA = z
  .object({
    /** Determines the type of target a spell can affect */
    type: z.enum(TargetTypes).default("none"),
    /**
     * Determines how many of `type` a spell can affect. Usually only applies
     * when `type` is `creature`
     */
    count: COMP_NUM_SCHEMA.default({}),
    /** Determines if the area of effect can grow based on potency */
    aoeType: z.enum(AOETypes).default("none"),
    /** Determines the size of the area of effect if static */
    fixedAoE: z.enum(SplashSizes).default("tiny")
  })
  .default({});

export type TargetSource = z.infer<typeof TARGET_SCHEMA>;

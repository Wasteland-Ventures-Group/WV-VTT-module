import { z } from "zod";
import { SplashSizes, TargetTypes } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../../common.js";

export const AOETypes = ["none", "fixed", "varies"] as const;

export const TARGET_SOURCE_SCHEMA = z
  .object({
    /** Determines the type of target a spell can affect */
    type: z
      .enum(TargetTypes)
      .default("none")
      .describe("Determines the type of target a spell can affect"),

    /**
     * Determines how many of `type` a spell can affect. Usually only applies
     * when `type` is `creature`
     */
    count: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
      "Determines how many of `type` a spell can affect. Usually only applies " +
        "when `type` is `creature`"
    ),

    /** Determines if the area of effect can grow based on potency */
    aoeType: z
      .enum(AOETypes)
      .default("none")
      .describe("Determines if the area of effect can grow based on potency"),

    /** Determines the size of the area of effect if static */
    fixedAoE: z
      .enum(SplashSizes)
      .default("tiny")
      .describe("Determines the size of the area of effect if static")
  })
  .default({});

export type TargetSource = z.infer<typeof TARGET_SOURCE_SCHEMA>;

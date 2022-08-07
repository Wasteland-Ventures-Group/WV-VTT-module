import type { JSONSchemaType } from "ajv";
import {
  SplashSize,
  SplashSizes,
  TargetType,
  TargetTypes
} from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../../common.js";

const AOETypes = ["none", "fixed", "varies"] as const;
type AOEType = typeof AOETypes[number];
export class TargetSource {
  type: TargetType = "none";

  count: CompositeNumberSource = { source: 0 };

  aoeType: AOEType = "none";

  fixedAoE: SplashSize = "tiny";
}

export const TARGET_JSON_SCHEMA: JSONSchemaType<TargetSource> = {
  type: "object",
  properties: {
    type: {
      description: "How a spell determines its target",
      type: "string",
      enum: TargetTypes,
      default: "none"
    },
    count: {
      description:
        "The number of creatures this spell can individually target. Only applies when `type` is `creature`",
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
    },
    aoeType: {
      description:
        "Whether or not a spell has an area of effect, and if it is fixed or varies based on potency.",
      type: "string",
      enum: AOETypes,
      default: "none"
    },
    fixedAoE: {
      description:
        "If a spell has a fixed area of effect, this determines its size",
      type: "string",
      enum: SplashSizes,
      default: "tiny"
    }
  },
  required: ["type", "aoeType", "fixedAoE"],
  additionalProperties: false
};

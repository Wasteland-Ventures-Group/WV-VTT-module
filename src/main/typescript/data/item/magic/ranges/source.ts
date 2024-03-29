import type { JSONSchemaType } from "ajv";
import {
  SpellRange,
  SpellRanges,
  SplashSize,
  SplashSizes
} from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../../common.js";

export class RangeSource {
  type: SpellRange = "none";

  distanceScale: CompositeNumberSource = { source: 0 };

  distanceBase: CompositeNumberSource = { source: 0 };

  splashSize: SplashSize = "tiny";

  description: string = "";
}

export const RANGES_JSON_SCHEMA: JSONSchemaType<RangeSource> = {
  description: "Description of how a spell's range operations",
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: SpellRanges
    },
    distanceScale: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description:
        "How much potency influences the range of a spell with a range of 'distance'",
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 1
        }
      }
    },
    distanceBase: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 1
        }
      },
      description:
        "The flat, non-scaling part of a spell's range (provided it has a range of 'distance')."
    },
    splashSize: {
      description:
        "The size of the splash, provided this spell has a range of 'splash'",
      type: "string",
      enum: SplashSizes,
      default: "tiny"
    },
    description: {
      description:
        "Description of the range, if the spell has a range of 'other'",
      type: "string",
      default: ""
    }
  },
  required: [
    "type",
    "description",
    "splashSize",
    "distanceBase",
    "distanceScale"
  ],
  additionalProperties: false
};

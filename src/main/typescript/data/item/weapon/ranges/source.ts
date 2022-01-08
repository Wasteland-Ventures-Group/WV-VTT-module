import type { JSONSchemaType } from "ajv";
import { SpecialName, SpecialNames } from "../../../../constants.js";

/** An interface that represents the source ranges of a weapon. */
export default interface Ranges {
  /** The short range of the weapon */
  short: Range;

  /**
   * The medium range of the weapon. By default the weapon has no medium range.
   */
  medium?: Range;

  /** The long range of the weapon. By default the weapon has no long range. */
  long?: Range;
}

/** An interface to represent values needed for an weapon's range */
export interface Range {
  /**
   * The maximum distance of this range in meters. It can either be a number,
   * which represents a distance in meters, "melee" or a SPECIAL based range,
   * with a base range, a multiplier and a SPECIAL name.
   */
  distance: Distance;

  /** The skill check modifier associated with this range */
  modifier: number;
}

/** A distance specifier for a weapon range. */
export type Distance = number | "melee" | SpecialBasedRange;

/** A SPECIAL based range */
export interface SpecialBasedRange {
  /** The base range of the range in meters */
  base: number;

  /** The SPECIAL multiplier */
  multiplier: number;

  /** The name of the SPECIAL to use */
  special: SpecialName;
}

/** A JSON schema for a single range object */
const RANGE_JSON_SCHEMA: JSONSchemaType<Range> = {
  description: "A range definition",
  type: "object",
  properties: {
    distance: {
      description:
        "The distance of the range. This can either be a number for a " +
        'distance in meters, the word "melee" for melee range or an object ' +
        "for a SPECIAL based distance.",
      oneOf: [
        {
          description: "A distance in meters",
          type: "integer",
          default: 0
        },
        {
          description: "A distance in melee range",
          type: "string",
          const: "melee",
          default: "melee"
        },
        {
          description: "A SPECIAL based distance",
          type: "object",
          properties: {
            base: {
              description: "The flat base distance of the distance in meters",
              type: "integer",
              default: 0
            },
            multiplier: {
              description: "The SPECIAL multiplier for the distance",
              type: "integer",
              default: 1
            },
            special: {
              description:
                "The SPECIAL to multiply and add to the base distance",
              type: "string",
              enum: SpecialNames,
              default: "strength"
            }
          },
          required: ["base", "multiplier", "special"],
          additionalProperties: false,
          default: {
            base: 0,
            multiplier: 1,
            special: "strength"
          }
        }
      ]
    },
    modifier: {
      description: "A hit chance modifier, active on this range",
      type: "integer",
      default: 0
    }
  },
  required: ["distance", "modifier"],
  additionalProperties: false,
  default: {
    distance: 20,
    modifier: 0
  }
};

/** A JSON schema for ranges objects */
export const RANGES_JSON_SCHEMA: JSONSchemaType<Ranges> = {
  description: "Ranges definitions",
  type: "object",
  properties: {
    short: {
      ...RANGE_JSON_SCHEMA,
      description: "The short range specification"
    },
    medium: {
      ...RANGE_JSON_SCHEMA,
      description: "The medium range specification",
      nullable: true,
      default: {
        distance: 40,
        modifier: -10
      }
    },
    long: {
      ...RANGE_JSON_SCHEMA,
      description: "The long range specification",
      nullable: true,
      default: {
        distance: 60,
        modifier: -20
      }
    }
  },
  required: ["short"],
  additionalProperties: false,
  default: {
    short: RANGE_JSON_SCHEMA.default
  }
};

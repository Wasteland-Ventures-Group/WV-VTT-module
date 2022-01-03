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

/**
 * A distance specifier for a weapon range.
 */
export type Distance = number | "melee" | SpecialBasedRange;

/**
 * A SPECIAL based range
 */
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
  type: "object",
  properties: {
    distance: {
      oneOf: [
        { type: "integer" },
        { type: "string", const: "melee" },
        {
          type: "object",
          properties: {
            base: { type: "integer" },
            multiplier: { type: "integer" },
            special: { type: "string", enum: SpecialNames }
          },
          required: ["base", "multiplier", "special"],
          additionalProperties: false
        }
      ]
    },
    modifier: { type: "integer" }
  },
  required: ["distance", "modifier"],
  additionalProperties: false
};

/** A JSON schema for ranges objects */
export const RANGES_JSON_SCHEMA: JSONSchemaType<Ranges> = {
  type: "object",
  properties: {
    short: { ...RANGE_JSON_SCHEMA },
    medium: { ...RANGE_JSON_SCHEMA, nullable: true },
    long: { ...RANGE_JSON_SCHEMA, nullable: true }
  },
  required: ["short"],
  additionalProperties: false
};

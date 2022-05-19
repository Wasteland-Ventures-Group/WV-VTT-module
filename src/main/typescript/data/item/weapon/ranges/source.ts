import type { JSONSchemaType } from "ajv";
import { SpecialName, SpecialNames } from "../../../../constants.js";
import {
  ModifiableNumber,
  MODIFIABLE_NUMBER_JSON_SCHEMA
} from "../../../common.js";

/** An interface that represents the source ranges of a weapon. */
export default interface RangesSource {
  /** The short range of the weapon */
  short: RangeSource;

  /**
   * The medium range of the weapon. By default the weapon has no medium range.
   */
  medium: RangeSource;

  /** The long range of the weapon. By default the weapon has no long range. */
  long: RangeSource;
}

/** An interface to represent values needed for an weapon's range */
export interface RangeSource {
  /**
   * The maximum distance of this range in meters. It can either be a number,
   * which represents a distance in meters, "melee" or a SPECIAL based range,
   * with a base range, a multiplier and a SPECIAL name.
   */
  distance: DistanceSource;

  /** The skill check modifier associated with this range */
  modifier: ModifiableNumber;
}

/** A distance specifier for a weapon range. */
export interface DistanceSource {
  /** The base range of the range in meters */
  base: ModifiableNumber;

  /** The SPECIAL multiplier */
  multiplier: ModifiableNumber;

  /** The name of the SPECIAL to use */
  special: SpecialName | "";
}

/** A JSON schema for a single range object */
const RANGE_JSON_SCHEMA: JSONSchemaType<RangeSource> = {
  description: "A range definition",
  type: "object",
  properties: {
    distance: {
      description: "The distance of the range.",
      type: "object",
      properties: {
        base: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA,
          description: "The flat base distance of the distance in meters",
          properties: {
            source: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            },
            total: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        multiplier: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA,
          description: "The SPECIAL multiplier for the distance, can be 0.",
          properties: {
            source: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            },
            total: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        special: {
          description:
            "The SPECIAL to multiply and add to the base distance, can be empty.",
          type: "string",
          enum: ["", ...SpecialNames],
          default: ""
        }
      },
      required: ["base", "multiplier", "special"],
      additionalProperties: false,
      default: {
        base: {
          source: 0
        },
        multiplier: {
          source: 0
        },
        special: ""
      }
    },
    modifier: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "A hit chance modifier, active on this range",
      properties: {
        source: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        },
        total: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    }
  },
  required: ["distance", "modifier"],
  additionalProperties: false,
  default: {
    distance: {
      base: {
        source: 0
      },
      multiplier: {
        source: 0
      },
      special: ""
    },
    modifier: {
      source: 0
    }
  }
};

/** A JSON schema for ranges objects */
export const RANGES_JSON_SCHEMA: JSONSchemaType<RangesSource> = {
  description: "Ranges definitions",
  type: "object",
  properties: {
    short: {
      ...RANGE_JSON_SCHEMA,
      description: "The short range specification"
    },
    medium: {
      ...RANGE_JSON_SCHEMA,
      description: "The medium range specification"
    },
    long: {
      ...RANGE_JSON_SCHEMA,
      description: "The long range specification"
    }
  },
  required: ["short", "medium", "long"],
  additionalProperties: false,
  default: {
    short: RANGE_JSON_SCHEMA.default,
    medium: RANGE_JSON_SCHEMA.default,
    long: RANGE_JSON_SCHEMA.default
  },
  examples: [
    {
      short: {
        distance: {
          base: {
            source: 2
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: 0
        }
      },
      medium: {
        distance: {
          base: {
            source: 0
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: 0
        }
      },
      long: {
        distance: {
          base: {
            source: 0
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: 0
        }
      }
    },
    {
      short: {
        distance: {
          base: {
            source: 20
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: 0
        }
      },
      medium: {
        distance: {
          base: {
            source: 40
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: -10
        }
      },
      long: {
        distance: {
          base: {
            source: 60
          },
          multiplier: {
            source: 0
          },
          special: ""
        },
        modifier: {
          source: -20
        }
      }
    }
  ]
};

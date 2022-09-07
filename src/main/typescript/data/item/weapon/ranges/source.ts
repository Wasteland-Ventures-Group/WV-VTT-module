import type { JSONSchemaType } from "ajv";
import { SpecialName, SpecialNames } from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../../common.js";
import { TAGS_SOURCE_JSON_SCHEMA } from "../../common/baseItem/source.js";

export default class RangesSource {
  /** The short range of the weapon */
  short = new RangeSource();

  /** The medium range of the weapon */
  medium = new RangeSource();

  /** The long range of the weapon */
  long = new RangeSource();
}

export class RangeSource {
  /** The distance of the range */
  distance = new DistanceSource();

  /** The skill check modifier associated with this range */
  modifier: CompositeNumberSource = { source: 0 };

  /** Tags of the range */
  tags: string[] = [];
}

export class DistanceSource {
  /** The base distance of the range distance in meters */
  base: CompositeNumberSource = { source: 0 };

  /** The SPECIAL multiplier of the range distance */
  multiplier: CompositeNumberSource = { source: 0 };

  /** The name of the SPECIAL to use for the range distance */
  special: SpecialName | "" = "";
}

const RANGE_JSON_SCHEMA: JSONSchemaType<RangeSource> = {
  description: "A range definition",
  type: "object",
  properties: {
    distance: {
      description: "The distance of the range",
      type: "object",
      properties: {
        base: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
          description: "The flat base distance of the distance in meters",
          properties: {
            source: {
              ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        multiplier: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
          description: "The SPECIAL multiplier for the distance, can be 0.",
          properties: {
            source: {
              ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
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
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description: "A hit chance modifier, active on this range",
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    },
    tags: {
      ...TAGS_SOURCE_JSON_SCHEMA,
      description: "Tags of the range"
    }
  },
  required: ["distance", "modifier", "tags"],
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
    },
    tags: []
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
        },
        tags: ["melee"]
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
        },
        tags: []
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
        },
        tags: []
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
        },
        tags: []
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
        },
        tags: []
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
        },
        tags: []
      }
    }
  ]
};

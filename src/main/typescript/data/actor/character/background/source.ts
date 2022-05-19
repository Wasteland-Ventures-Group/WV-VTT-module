import type { JSONSchemaType } from "ajv";
import { CONSTANTS, Race, Races } from "../../../../constants.js";
import {
  ModifiableNumber,
  MODIFIABLE_NUMBER_JSON_SCHEMA
} from "../../../common.js";

/** An Actor background object for the database */
export default class BackgroundSource {
  /** The race of an Actor */
  race: Race = "earthPony";

  /** The age of an Actor */
  age = "";

  /** The gender of an Actor */
  gender = "";

  /** The cutie mark of an Actor */
  cutieMark = "";

  /** The appearance of an Actor */
  appearance = "";

  /** The background of an Actor */
  background = "";

  /** The fears of an Actor */
  fears = "";

  /** The dreams of an Actor */
  dreams = "";

  /** The current karma of an Actor */
  karma = 0;

  /** The personality of an Actor */
  personality = "";

  /** The current size of an Actor */
  size = new ModifiableNumber(0);

  /** The social contacts of an Actor */
  socialContacts = "";

  /** The special talent of an Actor */
  specialTalent = "";

  /** The virtue of an Actor */
  virtue = "";
}

export const BACKGROUND_JSON_SCHEMA: JSONSchemaType<BackgroundSource> = {
  description: "A background specification",
  type: "object",
  properties: {
    race: {
      description: "The race of the character",
      type: "string",
      enum: Races
    },
    age: {
      description: "The age of the character",
      type: "string"
    },
    gender: {
      description: "The gender of the character",
      type: "string"
    },
    cutieMark: {
      description: "The cutie mark description of the character",
      type: "string"
    },
    appearance: {
      description: "The appearance of the character",
      type: "string"
    },
    background: {
      description: "The background of the character",
      type: "string"
    },
    fears: {
      description: "The fears of the character",
      type: "string"
    },
    dreams: {
      description: "The dreams of the character",
      type: "string"
    },
    karma: {
      description: "The karma of the character",
      type: "integer",
      maximum: CONSTANTS.bounds.karma.max,
      minimum: CONSTANTS.bounds.karma.min
    },
    personality: {
      description: "The personality of the character",
      type: "string"
    },
    size: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "The size of the character",
      properties: {
        source: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
          type: "integer",
          maximum: CONSTANTS.bounds.size.max,
          minimum: CONSTANTS.bounds.size.min,
          default: 0
        },
        total: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
          type: "integer",
          maximum: CONSTANTS.bounds.size.max,
          minimum: CONSTANTS.bounds.size.min
        }
      },
      default: {
        source: 0
      }
    },
    socialContacts: {
      description: "The social contacts of the character",
      type: "string"
    },
    specialTalent: {
      description: "The special talent description of the character",
      type: "string"
    },
    virtue: {
      description: "The virtue of the character",
      type: "string"
    }
  },
  required: ["race", "karma", "size"],
  additionalProperties: false,
  default: {
    race: "earthPony",
    age: "",
    gender: "",
    cutieMark: "",
    appearance: "",
    background: "",
    fears: "",
    dreams: "",
    karma: 0,
    personality: "",
    size: {
      source: 0
    },
    socialContacts: "",
    specialTalent: "",
    virtue: ""
  }
};

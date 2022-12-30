import type { JSONSchemaType } from "ajv";
import { CONSTANTS } from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMP_NUM_JSON_SCHEMA
} from "../../../common.js";

export default class BackgroundSource {
  /** The age of the character */
  age = "";

  /** The gender of the character */
  gender = "";

  /** The cutie mark description of the character */
  cutieMark = "";

  /** The appearance of the character */
  appearance = "";

  /** The background of the character */
  background = "";

  /** The fears of the character */
  fears = "";

  /** The dreams of the character */
  dreams = "";

  /** The karma of the character */
  karma = 0;

  /** The personality of the character */
  personality = "";

  /** The size of the character */
  size: CompositeNumberSource = { source: 0 };

  /** The social contacts of the character */
  socialContacts = "";

  /** The special talent description of the character */
  specialTalent = "";

  /** The virtue of the character */
  virtue = "";
}

export const BACKGROUND_JSON_SCHEMA: JSONSchemaType<BackgroundSource> = {
  description: "A background specification",
  type: "object",
  properties: {
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
      ...COMP_NUM_JSON_SCHEMA,
      description: "The size of the character",
      properties: {
        source: {
          ...COMP_NUM_JSON_SCHEMA.properties.source,
          type: "integer",
          maximum: CONSTANTS.bounds.size.max,
          minimum: CONSTANTS.bounds.size.min,
          default: 0
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
  required: ["karma", "size"],
  additionalProperties: false,
  default: {
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

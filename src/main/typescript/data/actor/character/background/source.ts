import type { JSONSchemaType } from "ajv";
import { CONSTANTS, Race, Races } from "../../../../constants.js";

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
  size = 0;

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
      enum: Races,
      nullable: true
    },
    age: {
      description: "The age of the character",
      type: "string",
      nullable: true
    },
    gender: {
      description: "The gender of the character",
      type: "string",
      nullable: true
    },
    cutieMark: {
      description: "The cutie mark description of the character",
      type: "string",
      nullable: true
    },
    appearance: {
      description: "The appearance of the character",
      type: "string",
      nullable: true
    },
    background: {
      description: "The background of the character",
      type: "string",
      nullable: true
    },
    fears: {
      description: "The fears of the character",
      type: "string",
      nullable: true
    },
    dreams: {
      description: "The dreams of the character",
      type: "string",
      nullable: true
    },
    karma: {
      description: "The karma of the character",
      type: "integer",
      nullable: true,
      maximum: CONSTANTS.bounds.karma.max,
      minimum: CONSTANTS.bounds.karma.min
    },
    personality: {
      description: "The personality of the character",
      type: "string",
      nullable: true
    },
    size: {
      description: "The size of the character",
      type: "integer",
      nullable: true,
      maximum: CONSTANTS.bounds.size.max,
      minimum: CONSTANTS.bounds.size.min
    },
    socialContacts: {
      description: "The social contacts of the character",
      type: "string",
      nullable: true
    },
    specialTalent: {
      description: "The special talent description of the character",
      type: "string",
      nullable: true
    },
    virtue: {
      description: "The virtue of the character",
      type: "string",
      nullable: true
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
    size: 0,
    socialContacts: "",
    specialTalent: "",
    virtue: ""
  }
};

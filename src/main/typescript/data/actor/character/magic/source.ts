import type { JSONSchemaType } from "ajv";
import {
  ThaumaturgySpecial,
  ThaumaturgySpecials
} from "../../../../constants.js";

/** An Actor magic object for the database */
export default class MagicSource {
  /** The SPECIAL associated with the Thaumaturgy skill */
  thaumSpecial: ThaumaturgySpecial = "intelligence";
}

export const MAGIC_JSON_SCHEMA: JSONSchemaType<MagicSource> = {
  description: "A magic specification",
  type: "object",
  properties: {
    thaumSpecial: {
      description: "The selected Thaumaturgy SPECIAL of the character",
      type: "string",
      enum: ThaumaturgySpecials
    }
  },
  required: ["thaumSpecial"],
  additionalProperties: false,
  default: {
    thaumSpecial: "intelligence"
  }
};

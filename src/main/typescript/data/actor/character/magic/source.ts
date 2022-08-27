import type { JSONSchemaType } from "ajv";
import {
  SpecialName,
  SpecialNames,
  ThaumaturgySpecial,
  ThaumaturgySpecials
} from "../../../../constants.js";

type CharacterMagicSpecials = Partial<Record<string, SpecialName>>;
export default class MagicSource {
  /** The SPECIAL of the character associated with the Thaumaturgy skill */
  thaumSpecial: ThaumaturgySpecial = "intelligence";

  magicSpecials: CharacterMagicSpecials = {};
}

export const MAGIC_JSON_SCHEMA: JSONSchemaType<MagicSource> = {
  description: "A magic specification",
  type: "object",
  properties: {
    thaumSpecial: {
      description: "The selected Thaumaturgy SPECIAL of the character",
      type: "string",
      enum: ThaumaturgySpecials
    },
    magicSpecials: {
      type: "object",
      additionalProperties: {
        type: "string",
        enum: SpecialNames
      }
    }
  },
  required: ["thaumSpecial", "magicSpecials"],
  additionalProperties: false,
  default: {
    thaumSpecial: "intelligence"
  }
};

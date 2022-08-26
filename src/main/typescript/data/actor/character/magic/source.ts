import type { JSONSchemaType } from "ajv";
import {
  GeneralMagicSchool,
  SpecialName,
  ThaumaturgySpecial,
  ThaumaturgySpecials
} from "../../../../constants.js";

type CharacterMagicSpecials = Partial<Record<GeneralMagicSchool, SpecialName>>;
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
      additionalProperties: true
    }
  },
  required: ["thaumSpecial"],
  additionalProperties: false,
  default: {
    thaumSpecial: "intelligence"
  }
};

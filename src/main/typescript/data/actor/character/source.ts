import type { JSONSchemaType } from "ajv";
import { TYPES } from "../../../constants.js";
import type { TemplateDocumentType } from "../../common.js";
import BackgroundSource, {
  BACKGROUND_JSON_SCHEMA
} from "./background/source.js";
import LevelingSource, { LEVELING_JSON_SCHEMA } from "./leveling/source.js";
import MagicSource, { MAGIC_JSON_SCHEMA } from "./magic/source.js";
import VitalsSource, { VITALS_JSON_SCHEMA } from "./vitals/source.js";

/** The character data-source */
export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

/** The character data-source data */
export class CharacterDataSourceData implements TemplateDocumentType {
  /** The vitals of an Actor */
  vitals = new VitalsSource();

  /** The leveling stats of an Actor */
  leveling = new LevelingSource();

  /** The magic stats of an Actor */
  magic = new MagicSource();

  /** The background of an Actor */
  background = new BackgroundSource();

  /** @override */
  getTypeName(): string {
    return TYPES.ACTOR.CHARACTER;
  }
}

export const CHARACTER_JSON_SCHEMA: JSONSchemaType<
  Omit<CharacterDataSourceData, "getTypeName">
> = {
  description: "The system data for a character Actor",
  type: "object",
  properties: {
    vitals: VITALS_JSON_SCHEMA,
    leveling: LEVELING_JSON_SCHEMA,
    magic: MAGIC_JSON_SCHEMA,
    background: BACKGROUND_JSON_SCHEMA
  },
  required: ["vitals", "leveling", "magic", "background"],
  additionalProperties: false,
  default: {
    vitals: VITALS_JSON_SCHEMA.default,
    leveling: LEVELING_JSON_SCHEMA.default,
    magic: MAGIC_JSON_SCHEMA.default,
    background: BACKGROUND_JSON_SCHEMA.default
  }
};

import type { JSONSchemaType } from "ajv";
import type { TYPES } from "../../../constants.js";
import BackgroundSource, {
  BACKGROUND_JSON_SCHEMA
} from "./background/source.js";
import EquipmentSource, { EQUIPMENT_JSON_SCHEMA } from "./equipment/source.js";
import LevelingSource, { LEVELING_JSON_SCHEMA } from "./leveling/source.js";
import MagicSource, { MAGIC_JSON_SCHEMA } from "./magic/source.js";
import VitalsSource, { VITALS_JSON_SCHEMA } from "./vitals/source.js";

export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

export class CharacterDataSourceData {
  /** The background of the character */
  background = new BackgroundSource();

  /** The equipment of the character */
  equipment = new EquipmentSource();

  /** The leveling stats of the character */
  leveling = new LevelingSource();

  /** The magic stats of the character */
  magic = new MagicSource();

  /** The vitals of the character */
  vitals = new VitalsSource();
}

export const CHARACTER_JSON_SCHEMA: JSONSchemaType<CharacterDataSourceData> = {
  description: "The system data for a character Actor",
  type: "object",
  properties: {
    background: BACKGROUND_JSON_SCHEMA,
    equipment: EQUIPMENT_JSON_SCHEMA,
    leveling: LEVELING_JSON_SCHEMA,
    magic: MAGIC_JSON_SCHEMA,
    vitals: VITALS_JSON_SCHEMA
  },
  required: ["vitals", "leveling", "equipment", "magic", "background"],
  additionalProperties: false,
  default: {
    background: BACKGROUND_JSON_SCHEMA.default,
    equipment: EQUIPMENT_JSON_SCHEMA.default,
    leveling: LEVELING_JSON_SCHEMA.default,
    magic: MAGIC_JSON_SCHEMA.default,
    vitals: VITALS_JSON_SCHEMA.default
  }
};

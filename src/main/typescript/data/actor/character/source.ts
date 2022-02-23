import type { JSONSchemaType } from "ajv";
import type { TYPES } from "../../../constants.js";
import BackgroundSource, {
  BACKGROUND_JSON_SCHEMA
} from "./background/source.js";
import EquipmentSource, { EQUIPMENT_JSON_SCHEMA } from "./equipment/source.js";
import LevelingSource, { LEVELING_JSON_SCHEMA } from "./leveling/source.js";
import MagicSource, { MAGIC_JSON_SCHEMA } from "./magic/source.js";
import VitalsSource, { VITALS_JSON_SCHEMA } from "./vitals/source.js";

/** The character data-source */
export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

/** The character data-source data */
export class CharacterDataSourceData {
  /** The vitals of an Actor */
  vitals = new VitalsSource();

  /** The leveling stats of an Actor */
  leveling = new LevelingSource();

  /** The equipment of an Actor */
  equipment = new EquipmentSource();

  /** The magic stats of an Actor */
  magic = new MagicSource();

  /** The background of an Actor */
  background = new BackgroundSource();
}

export const CHARACTER_JSON_SCHEMA: JSONSchemaType<CharacterDataSourceData> = {
  description: "The system data for a character Actor",
  type: "object",
  properties: {
    vitals: VITALS_JSON_SCHEMA,
    leveling: LEVELING_JSON_SCHEMA,
    equipment: EQUIPMENT_JSON_SCHEMA,
    magic: MAGIC_JSON_SCHEMA,
    background: BACKGROUND_JSON_SCHEMA
  },
  required: ["vitals", "leveling", "equipment", "magic", "background"],
  additionalProperties: false,
  default: {
    vitals: VITALS_JSON_SCHEMA.default,
    leveling: LEVELING_JSON_SCHEMA.default,
    equipment: EQUIPMENT_JSON_SCHEMA.default,
    magic: MAGIC_JSON_SCHEMA.default,
    background: BACKGROUND_JSON_SCHEMA.default
  }
};

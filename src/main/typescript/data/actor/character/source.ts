import type { TYPES } from "../../../constants.js";
import { EQUIPMENT_SCHEMA } from "./equipment/source.js";
import { LEVELING_SCHEMA } from "./leveling/source.js";
import MagicSource from "./magic/source.js";
import { VITALS_SCHEME, } from "./vitals/source.js";
import fields = foundry.data.fields;
import { BACKGROUND_SCHEMA } from "./background/source.js";

export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

export const CHARACTER_SCHEMA = {
  /** The vitals of the character */
  vitals: new fields.SchemaField(VITALS_SCHEME),
  /** The equipment of the character */
  equipment: new fields.SchemaField(EQUIPMENT_SCHEMA),
  /** The leveling stats of the character */
  leveling: new fields.SchemaField(LEVELING_SCHEMA),
  /** The background of the character */
  background: new fields.SchemaField(BACKGROUND_SCHEMA)
};

export type CharacterSource = fields.SchemaField.InitializedData<typeof CHARACTER_SCHEMA>;

export type CharacterDataSourceData = {
  /** The magic stats of the character */
  magic: MagicSource;
}

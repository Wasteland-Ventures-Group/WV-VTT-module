import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import type { TYPES } from "../../../constants.js";
import { BACKGROUND_SCHEMA } from "./background/source.js";
import { EQUIPMENT_SCHEMA } from "./equipment/source.js";
import { LEVELING_SCHEMA } from "./leveling/source.js";
import { MAGIC_SCHEMA } from "./magic/source.js";
import { VITALS_SCHEMA } from "./vitals/source.js";

export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

export type CharacterDataSourceData = z.infer<typeof CHARACTER_SCHEMA>;
export const CHARACTER_SCHEMA = z.object({
  /** The background of the character */
  background: BACKGROUND_SCHEMA.default({}),

  /** The equipment of the character */
  equipment: EQUIPMENT_SCHEMA.default({}),

  /** The leveling stats of the character */
  leveling: LEVELING_SCHEMA,

  /** The magic stats of the character */
  magic: MAGIC_SCHEMA,

  /** The vitals of the character */
  vitals: VITALS_SCHEMA
});

export const CHARACTER_JSON_SCHEMA = zodToJsonSchema(CHARACTER_SCHEMA);

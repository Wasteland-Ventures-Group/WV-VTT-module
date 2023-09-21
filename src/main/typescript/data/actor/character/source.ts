import { z } from "zod";
import type { TYPES } from "../../../constants.js";
import { BACKGROUND_SOURCE_SCHEMA } from "./background/source.js";
import { EQUIPMENT_SOURCE_SCHEMA } from "./equipment/source.js";
import { LEVELING_SOURCE_SCHEMA } from "./leveling/source.js";
import { MAGIC_SOURCE_SCHEMA } from "./magic/source.js";
import { VITALS_SOURCE_SCHEMA } from "./vitals/source.js";

export default interface CharacterDataSource {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataSourceData;
}

export type CharacterDataSourceData = z.infer<typeof CHARACTER_SOURCE_SCHEMA>;
export const CHARACTER_SOURCE_SCHEMA = z
  .object({
    /** The background of the character */
    background: BACKGROUND_SOURCE_SCHEMA.default({}),

    /** The equipment of the character */
    equipment: EQUIPMENT_SOURCE_SCHEMA.default({}),

    /** The leveling stats of the character */
    leveling: LEVELING_SOURCE_SCHEMA.default({}),

    /** The magic stats of the character */
    magic: MAGIC_SOURCE_SCHEMA.default({}),

    /** The vitals of the character */
    vitals: VITALS_SOURCE_SCHEMA.default({})
  })
  .default({});

import { TYPES, GeneralMagicSchools } from "../../../constants.js";
import { RANGE_SCHEMA } from "./ranges/source.js";
import { TargetSchema } from "./target/source.js";
import { CompositeNumberSchema } from "../../common.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  compDataZodSchema,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export const MAGIC_SCHEMA = BASE_ITEM_SCHEMA.extend({
  school: z.enum(GeneralMagicSchools).default("general"),
  apCost: CompositeNumberSchema,
  strainCost: CompositeNumberSchema,
  range: RANGE_SCHEMA,
  target: TargetSchema
}).default({});

export interface CompendiumMagic
  extends FoundryCompendiumData<MagicDataSourceData> {
  type: typeof TYPES.ITEM.MAGIC;
}

export const COMP_MAGIC_SCHEMA = compDataZodSchema(
  MAGIC_SCHEMA,
  "magic",
  "icons/svg/daze.svg",
  "New Magic"
);
export const COMP_MAGIC_JSON_SCHEMA = zodToJsonSchema(COMP_MAGIC_SCHEMA);

export type MagicDataSourceData = z.infer<typeof MAGIC_SCHEMA>;
/** A JSON schema for magic source objects */
export const MAGIC_SOURCE_JSON_SCHEMA = zodToJsonSchema(MAGIC_SCHEMA);

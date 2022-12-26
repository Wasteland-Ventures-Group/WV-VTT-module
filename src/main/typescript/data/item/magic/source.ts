import { TYPES, GeneralMagicSchools } from "../../../constants.js";
import { RANGE_SCHEMA } from "./ranges/source.js";
import { TargetSchema } from "./target/source.js";
import { CompositeNumberSchema } from "../../common.js";
import { z } from "zod";
import {
  compDataZodSchema,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import zodToJsonSchema from "zod-to-json-schema";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export const MagicDataSchema = BASE_ITEM_SCHEMA.extend({
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

export const COMP_MAGIC_JSON_SCHEMA = zodToJsonSchema(
  compDataZodSchema(MagicDataSchema, "magic", "icons/svg/daze.svg", "New Magic")
);

export type MagicDataSourceData = z.infer<typeof MagicDataSchema>;
/** A JSON schema for magic source objects */

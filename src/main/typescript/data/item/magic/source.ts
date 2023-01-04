import { TYPES, GeneralMagicSchools } from "../../../constants.js";
import { RANGE_SOURCE_SCHEMA } from "./ranges/source.js";
import { TARGET_SOURCE_SCHEMA } from "./target/source.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../common.js";
import { z } from "zod";
import { compDataZodSchema } from "../../foundryCommon.js";
import { BASE_ITEM_SOURCE_SCHEMA } from "../common/baseItem/source.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export const MAGIC_SOURCE_SCHEMA = BASE_ITEM_SOURCE_SCHEMA.extend({
  /** The spell's magic school */
  school: z
    .enum(GeneralMagicSchools)
    .default("general")
    .describe("The spell's magic school"),

  /** The spell's Action Point cost */
  apCost: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The spell's Action Point cost"
  ),

  /** The spell's strain consumption */
  strainCost: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The spell's strain consumption"
  ),

  /** The spell's range information */
  range: RANGE_SOURCE_SCHEMA.describe("The spell's range information"),

  /** The spell's target information */
  target: TARGET_SOURCE_SCHEMA.describe("The spell's target information")
}).default({});

export const COMP_MAGIC_SCHEMA = compDataZodSchema(
  MAGIC_SOURCE_SCHEMA,
  "magic",
  "icons/svg/daze.svg",
  "New Magic"
);

export type MagicDataSourceData = z.infer<typeof MAGIC_SOURCE_SCHEMA>;

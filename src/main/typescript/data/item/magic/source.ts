import { TYPES, GeneralMagicSchools } from "../../../constants.js";
import { RANGE_SCHEMA } from "./ranges/source.js";
import { TARGET_SCHEMA } from "./target/source.js";
import { COMPOSITE_NUMBER_SCHEMA } from "../../common.js";
import { z } from "zod";
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
  /** The spell's magic school */
  school: z
    .enum(GeneralMagicSchools)
    .default("general")
    .describe("The spell's magic school"),

  /** The spell's Action Point cost */
  apCost: COMPOSITE_NUMBER_SCHEMA.default({}).describe(
    "The spell's Action Point cost"
  ),

  /** The spell's strain consumption */
  strainCost: COMPOSITE_NUMBER_SCHEMA.default({}).describe(
    "The spell's strain consumption"
  ),

  /** The spell's range information */
  range: RANGE_SCHEMA.describe("The spell's range information"),

  /** The spell's target information */
  target: TARGET_SCHEMA.describe("The spell's target information")
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

export type MagicDataSourceData = z.infer<typeof MAGIC_SCHEMA>;

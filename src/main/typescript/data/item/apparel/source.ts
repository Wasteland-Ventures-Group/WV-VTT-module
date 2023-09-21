import { z } from "zod";
import { ApparelSlots, ApparelTypes, TYPES } from "../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../common.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { PHYS_ITEM_SOURCE_SCHEMA } from "../common/physicalItem/source.js";

export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

export type ApparelDataSourceData = z.infer<typeof APPAREL_SOURCE_SCHEMA>;
export const APPAREL_SOURCE_SCHEMA = PHYS_ITEM_SOURCE_SCHEMA.extend({
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots: z
    .record(z.enum(ApparelSlots), z.boolean())
    .optional()
    .describe("The other apparel slots this apparel blocks aside from its own"),

  /** The damage threshold of the apparel */
  damageThreshold: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().describe(
    "The damage threshold of the apparel"
  ),

  /** The number of quick slots of the apparel */
  quickSlots: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().describe(
    "The number of quick slots of the apparel"
  ),

  /** The number of mod slots of the apparel */
  modSlots: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().describe(
    "The number of mod slots of the apparel"
  ),

  /** The apparel slot this apparel occupies when equipped */
  slot: z
    .enum(ApparelSlots)
    .default("clothing")
    .describe("The apparel slot this apparel occupies when equipped"),

  /** The sub type of the apparel */
  type: z
    .enum(ApparelTypes)
    .default("clothing")
    .describe("The sub type of the apparel")
}).default({});

export const COMP_APPAREL_SCHEMA = compDataZodSchema(
  APPAREL_SOURCE_SCHEMA,
  "apparel",
  "icons/equipment/chest/breastplate-leather-brown-belted.webp",
  "New Apparel"
);

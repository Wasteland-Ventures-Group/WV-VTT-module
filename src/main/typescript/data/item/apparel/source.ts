import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ApparelSlots, ApparelTypes, TYPES } from "../../../constants.js";
import { COMPOSITE_NUMBER_SCHEMA } from "../../common.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { PHYS_ITEM_SCHEMA } from "../common/physicalItem/source.js";

export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

export type ApparelDataSourceData = z.infer<typeof APPAREL_SCHEMA>;
export const APPAREL_SCHEMA = PHYS_ITEM_SCHEMA.extend({
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots: z.record(z.enum(ApparelSlots), z.boolean()).optional(),

  /** The damage threshold of the apparel */
  damageThreshold: COMPOSITE_NUMBER_SCHEMA.optional(),

  /** The number of quick slots of the apparel */
  quickSlots: COMPOSITE_NUMBER_SCHEMA.optional(),

  /** The number of mod slots of the apparel */
  modSlots: COMPOSITE_NUMBER_SCHEMA.optional(),

  /** The apparel slot this apparel occupies when equipped */
  slot: z.enum(ApparelSlots).default("clothing"),

  /** The sub type of the apparel */
  type: z.enum(ApparelTypes).default("clothing")
});

export const APPAREL_JSON_SCHEMA = zodToJsonSchema(APPAREL_SCHEMA);

export const COMP_APPAREL_SCHEMA = compDataZodSchema(
  APPAREL_SCHEMA,
  "apparel",
  "icons/equipment/chest/breastplate-leather-brown-belted.webp",
  "New Apparel"
);

export const COMP_APPAREL_JSON_SCHEMA = zodToJsonSchema(COMP_APPAREL_SCHEMA);

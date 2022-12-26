import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { ApparelSlots, ApparelTypes, TYPES } from "../../../constants.js";
import {
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
  COMP_NUM_SCHEMA
} from "../../common.js";
import {
  compDataZodSchema,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import { PHYS_ITEM_SCHEMA } from "../common/physicalItem/source.js";

export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

export type ApparelDataSourceData = z.infer<typeof APPAREL_SOURCE_SCHEMA>;
export const APPAREL_SOURCE_SCHEMA = PHYS_ITEM_SCHEMA.extend({
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots: z.record(z.enum(ApparelSlots), z.boolean()).optional(),

  /** The damage threshold of the apparel */
  damageThreshold: COMP_NUM_SCHEMA.optional().default({}),

  /** The number of quick slots of the apparel */
  quickSlots: COMP_NUM_SCHEMA.optional().default({}),

  /** The number of mod slots of the apparel */
  modSlots: COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.optional().default({}),

  /** The apparel slot this apparel occupies when equipped */
  slot: z.enum(ApparelSlots).default("clothing"),

  /** The sub type of the apparel */
  type: z.enum(ApparelTypes)
});

export interface CompendiumApparel
  extends FoundryCompendiumData<ApparelDataSourceData> {
  type: typeof TYPES.ITEM.APPAREL;
}

export const COMP_APPAREL_JSON_SCHEMA = zodToJsonSchema(
  compDataZodSchema(
    APPAREL_SOURCE_SCHEMA,
    "apparel",
    "icons/equipment/chest/breastplate-leather-brown-belted.webp",
    "New Apparel"
  )
);

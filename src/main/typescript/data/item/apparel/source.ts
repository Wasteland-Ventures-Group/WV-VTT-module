import { z } from "zod";
import { ApparelSlots, ApparelTypes, TYPES } from "../../../constants.js";
import {
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
  COMPOSITE_NUMBER_SOURCE_SCHEMA
} from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { PHYS_ITEM_SOURCE_SCHEMA } from "../common/physicalItem/source.js";

export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

export type ApparelDataSourceData = z.infer<typeof APPAREL_SOURCE_SCHEMA>;
export const APPAREL_SOURCE_SCHEMA = PHYS_ITEM_SOURCE_SCHEMA.extend({
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots: z.record(z.string(), z.boolean()).optional(),

  /** The damage threshold of the apparel */
  damageThreshold: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().default({}),

  /** The number of quick slots of the apparel */
  quickSlots: COMPOSITE_NUMBER_SOURCE_SCHEMA.optional().default({}),

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

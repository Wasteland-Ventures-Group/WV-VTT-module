import {
  type ApparelSlot,
  ApparelSlots,
  ApparelTypes,
  TYPES
} from "../../../constants.js";
import {
  type CompositeNumberSource,
  COMPOSITE_NUMBER_FIELD,
} from "../../common.js";
import { type FoundryCompendiumData } from "../../foundryCommon.js";
import { PHYS_ITEM_SCHEMA, } from "../common/physicalItem/source.js";

import fields = foundry.data.fields;

export const APPAREL_SCHEMA = {
  /** The apparel slot this apparel occupies when equipped */
  slot: new fields.StringField({ nullable: false, required: true, choices: ApparelSlots, initial: "clothing" }),
  /** The sub type of the apparel */
  type: new fields.StringField({ nullable: false, required: true, choices: ApparelTypes, initial: "clothing" }),
  /** The number of quick slots of the apparel */
  quickSlots: COMPOSITE_NUMBER_FIELD,
  ...PHYS_ITEM_SCHEMA
}


export class ApparelDataSourceData {
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots?: Record<ApparelSlot, boolean>;

  /** The damage threshold of the apparel */
  damageThreshold?: CompositeNumberSource = { source: 0 };

  /** The number of mod slots of the apparel */
  modSlots?: CompositeNumberSource = { source: 0 };
}

export interface CompendiumApparel
  extends FoundryCompendiumData<ApparelDataSourceData> {
  type: typeof TYPES.ITEM.APPAREL;
}

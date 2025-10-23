import type { ApparelSlot } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import { PhysicalItemProperties } from "../common/physicalItem/properties.js";
import { APPAREL_SCHEMA } from "./source.js";
import fields = foundry.data.fields;

export type ApparelProperties = ApparelSource & PhysicalItemProperties & {
  blockedSlots: Record<ApparelSlot, boolean>,
  damageThreshold: CompositeNumber,
  quickSlots: CompositeNumber,
  modSlots: CompositeNumber,
};

export type ApparelSource = fields.SchemaField.InitializedData<typeof APPAREL_SCHEMA>;

export namespace ApparelProperties {
  export function from(s: ApparelSource, owningItem: WvItem) {
    return {
      ...s,
      ...PhysicalItemProperties.from(s, owningItem),
    }
  }
}


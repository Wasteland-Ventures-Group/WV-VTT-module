import { ApparelSlot, ApparelSlots, TYPES } from "../constants.js";
import type ApparelDataProperties from "../data/item/apparel/properties.js";
import { ApparelDataPropertiesData } from "../data/item/apparel/properties.js";
import WvItem from "./wvItem.js";

/**
 * An Item that can represent an apparel item in the Wasteland Ventures system.
 */
export default class Apparel extends WvItem {
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.APPAREL)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.APPAREL}.`);

    super(data, context);
  }

  /** Get the system data of this weapon. */
  get systemData(): ApparelDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.APPAREL)
      throw new Error(`This data's data type is not ${TYPES.ITEM.APPAREL}.`);

    return this.data.data;
  }

  /** Get the slots that are blocked by this apparel. */
  get blockedApparelSlots(): ApparelSlot[] {
    const slots: Set<ApparelSlot> = new Set();

    for (const apparelSlot of ApparelSlots) {
      if (
        apparelSlot !== this.systemData.slot &&
        this.systemData.blockedSlots[apparelSlot]
      )
        slots.add(apparelSlot);
    }

    return [...slots];
  }

  override prepareBaseData(): void {
    this.data.data = new ApparelDataPropertiesData(this.systemData, this);
  }
}

import { type ApparelSlot, ApparelSlots, TYPES } from "../constants.js";
import WvItem from "./wvItem.js";

/**
 * An Item that can represent an apparel item in the Wasteland Ventures system.
 */
export default class Apparel extends WvItem<"apparel"> {
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.APPAREL)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.APPAREL}.`);

    super(data, context);
  }

  /** Get the slots that are blocked by this apparel. */
  get blockedApparelSlots(): ApparelSlot[] {
    const slots: Set<ApparelSlot> = new Set();

    for (const apparelSlot of ApparelSlots) {
      if (
        apparelSlot !== this.system.slot &&
        this.system.blockedSlots[apparelSlot]
      )
        slots.add(apparelSlot);
    }

    return [...slots];
  }
}

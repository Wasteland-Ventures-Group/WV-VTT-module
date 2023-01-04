import type Apparel from "../../../../item/apparel.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import type { EquipmentSource } from "./source.js";

export type EquipmentProperties = EquipmentSource & {
  quickSlots: CompositeResource;

  /** The damage threshold of the character */
  damageThreshold: CompositeNumber;

  /** AP costs for various equip actions */
  equipActionCosts: EquipActionCosts;

  /**
   * Modify the damage threshold and max quick slots by the equipped apparel's
   * values.
   */
  applyEquippedApparel(equippedApparel: Apparel[]): void;
};

export const EquipmentProperties = {
  from(source: EquipmentSource): EquipmentProperties {
    const quickSlots = CompositeResource.from(source.quickSlots);
    quickSlots.source = 0;
    quickSlots.bounds.min = 0;

    const equipActionCosts = new EquipActionCosts();

    return {
      ...source,
      quickSlots,
      equipActionCosts,
      damageThreshold: new CompositeNumber(),

      applyEquippedApparel(equippedApparel: Apparel[]) {
        equippedApparel.forEach((apparel) => {
          if (apparel.data.data.damageThreshold)
            this.damageThreshold.add({
              value: apparel.data.data.damageThreshold.total,
              labelComponents: [{ text: apparel.name ?? "" }]
            });

          if (apparel.data.data.quickSlots.total)
            this.quickSlots.add({
              value: apparel.data.data.quickSlots.total,
              labelComponents: [{ text: apparel.name ?? "" }]
            });
        });
      }
    };
  }
};

export class EquipActionCosts {
  /** The cost for unreadying an item or weapon */
  unready = new CompositeNumber(0, { min: 0 });

  /** The cost for readying an item from the inventory */
  readyDirect = new CompositeNumber(8, { min: 0 });

  /** The cost for readying an item with a slot */
  readyFromSlot = new CompositeNumber(3, { min: 0 });
}

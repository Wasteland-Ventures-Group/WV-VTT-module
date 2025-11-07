import type Apparel from "../../../../item/apparel.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import type { EquipmentSource } from "./source.js";

export type EquipmentProperties = EquipmentSource & {
  quickSlots: CompositeResource,
  /** The damage threshold of the character */
  damageThreshold: CompositeNumber,
  /** AP costs for various equip actions */
  equipActionCosts: EquipActionCosts,
  /** Equipped weapons. */
  weaponSlotIds: [string | null, string | null],
};

export namespace EquipmentProperties {
  export function from(source: EquipmentSource): EquipmentProperties {
    const slots: [string | null, string | null] = [source.weaponSlotIds[0] ?? null, source.weaponSlotIds[0] ?? null]
    const result = {
      ...source,
      quickSlots: CompositeResource.from(source.quickSlots),
      damageThreshold: new CompositeNumber(),
      equipActionCosts: new EquipActionCosts(),
      weaponSlotIds: slots
    };
    result.quickSlots.source = 0;
    result.quickSlots.bounds.min = 0;
    return result;
  }

  /**
   * Modify the damage threshold and max quick slots by the equipped apparel's
   * values.
   */
  export function applyEquippedApparel(self: EquipmentProperties, equippedApparel: Apparel[]) {
    equippedApparel.forEach((apparel) => {
      if (apparel.system.damageThreshold)
        self.damageThreshold.add({
          value: apparel.system.damageThreshold.total,
          labelComponents: [{ text: apparel.name ?? "" }]
        });

      if (apparel.system.quickSlots.total)
        self.quickSlots.add({
          value: apparel.system.quickSlots.total,
          labelComponents: [{ text: apparel.name ?? "" }]
        });
    });
  }
}

export class EquipActionCosts {
  /** The cost for unreadying an item or weapon */
  unready = new CompositeNumber(0, { min: 0 });

  /** The cost for readying an item from the inventory */
  readyDirect = new CompositeNumber(8, { min: 0 });

  /** The cost for readying an item with a slot */
  readyFromSlot = new CompositeNumber(3, { min: 0 });
}

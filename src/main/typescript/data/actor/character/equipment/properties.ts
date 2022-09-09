import type Apparel from "../../../../item/apparel.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import EquipmentSource from "./source.js";

export default class EquipmentProperties extends EquipmentSource {
  constructor(source: EquipmentSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.quickSlots = CompositeResource.from(source.quickSlots);
  }

  override quickSlots: CompositeResource;

  /** The damage threshold of the character */
  damageThreshold = new CompositeNumber();

  /** AP costs for various equip actions */
  equipActionCosts = new EquipActionCosts();

  /**
   * Modify the damage threshold and max quick slots by the equipped apparel's
   * values.
   */
  applyEquippedApparel(equippedApparel: Apparel[]) {
    equippedApparel.forEach((apparel) => {
      if (apparel.data.data.damageThreshold)
        this.damageThreshold.add({
          value: apparel.data.data.damageThreshold.total,
          labelComponents: [{ text: apparel.name ?? "" }]
        });

      if (apparel.data.data.quickSlots)
        this.quickSlots.add({
          value: apparel.data.data.quickSlots.total,
          labelComponents: [{ text: apparel.name ?? "" }]
        });
    });
  }
}

export class EquipActionCosts {
  /** The cost for unreadying an item or weapon */
  unready = new CompositeNumber(0);
}

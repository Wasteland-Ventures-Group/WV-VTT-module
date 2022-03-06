import EquipmentSource from "./source.js";

/** Derived equipment data. */
export default class Equipment extends EquipmentSource {
  /** The damage threshold granted by equipment. */
  damageThreshold?: number;

  /** The maximum number of quick slot charges granted by equipment. */
  maxQuickSlots?: number;
}

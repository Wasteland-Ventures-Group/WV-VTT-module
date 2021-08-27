import BaseItem from "./baseItem.js";

/** This holds the base values that all physical items have in common. */
export default abstract class PhysicalBaseItem extends BaseItem {
  /** The value of the item in caps */
  value: number = 0;

  /** The weight of the item in kg (can be floating point) */
  weight: number = 0;
}

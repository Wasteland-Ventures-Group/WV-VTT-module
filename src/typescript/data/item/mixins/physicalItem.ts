import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the PhysicalItem interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PhysicalItem<TBase extends AnyConstructor>(
  Base: TBase
) {
  return class PhysicalItemMixin extends Base implements PhysicalItem {
    value = 0;

    weight = 0;
  };
}

/** This holds the base values that all physical items have in common. */
export interface PhysicalItem {
  /** The value of the item in caps */
  value: number;

  /** The weight of the item in kg (can be floating point) */
  weight: number;
}

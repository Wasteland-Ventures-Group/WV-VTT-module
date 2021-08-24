import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the PhysicalItem interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Describable<TBase extends AnyConstructor>(Base: TBase) {
  return class DescribableMixin extends Base implements Describable {
    name = "";

    description = "";
  };
}

/** This holds the base values that all describable items have in common. */
export interface Describable {
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item.
   */
  name: string;

  /** The description of the item in the Wasteland Wares list. */
  description: string;
}

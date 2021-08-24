import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the StrengthRequiring interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function StrengthRequiring<TBase extends AnyConstructor>(
  Base: TBase
) {
  return class StrengthRequiringMixin
    extends Base
    implements StrengthRequiring
  {
    strengthRequirement = 0;
  };
}

/**
 * This holds base values for items that have a strength requirement to be
 * equipped.
 */
export interface StrengthRequiring {
  /** The strength requirement for this item to be equipped */
  strengthRequirement: number;
}

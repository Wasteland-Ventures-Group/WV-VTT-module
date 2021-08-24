import type { SpecialNames } from "../../../constants.js";
import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the Ranged interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Ranged<TBase extends AnyConstructor>(Base: TBase) {
  return class RangedMixin extends Base implements Ranged {
    ranges = {
      short: {
        distance: 20,
        modifier: 0
      },
      medium: {
        distance: 40,
        modifier: -10
      },
      long: {
        distance: 60,
        modifier: -20
      }
    } as Ranged["ranges"];
  };
}

/** This holds the base values that all ranged items have in common. */
export interface Ranged {
  /** Values related to ranged actions with this item */
  ranges: {
    /** The short range of the item */
    short: Range;

    /** The medium range of the item */
    medium: Range;

    /** The long range of the item */
    long: Range;
  };
}

/** A data structure to represent values needed for an item's range */
interface Range {
  /**
   * The maximum distance of this range in meters. It can either be a number,
   * which represents a distance in meters, "melee" or a SPECIAL based range,
   * with a base range, a multiplier and a SPECIAL name.
   */
  distance: Distance;

  /** The skill check modifier associated with this range */
  modifier: number;
}

/**
 * A distance specifier for an item range.
 */
type Distance = number | "melee" | SpecialBasedRange;

/**
 * A SPECIAL based range interface
 */
interface SpecialBasedRange {
  /** The base range of the range in meters */
  base: number;

  /** The special multiplier */
  multiplier: number;

  /** The name of the special to use */
  special: SpecialNames;
}

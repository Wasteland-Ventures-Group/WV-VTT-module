import type { SpecialNames } from "../../../constants.js";

/** An interface that represents the source ranges of a weapon. */
export default interface Ranges {
  /** The short range of the weapon */
  short: Range;

  /** The medium range of the weapon, can be "unused" */
  medium: Range | "unused";

  /** The long range of the weapon, can be "unused" */
  long: Range | "unused";
}

/** An interface to represent values needed for an weapon's range */
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
 * A distance specifier for a weapon range.
 */
type Distance = number | "melee" | SpecialBasedRange;

/**
 * A SPECIAL based range
 */
interface SpecialBasedRange {
  /** The base range of the range in meters */
  base: number;

  /** The SPECIAL multiplier */
  multiplier: number;

  /** The name of the SPECIAL to use */
  special: SpecialNames;
}

/** A type representing the different range brackets */
type RangeBracket = "short" | "medium" | "long";

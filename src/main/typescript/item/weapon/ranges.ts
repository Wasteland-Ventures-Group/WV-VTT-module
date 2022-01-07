import { CONSTANTS, SpecialName } from "../../constants.js";
import type { Specials } from "../../data/actor/properties.js";
import type WeaponDataProperties from "../../data/item/weapon/properties.js";
import type Ranges from "../../data/item/weapon/ranges/source.js";
import type {
  Distance,
  SpecialBasedRange
} from "../../data/item/weapon/ranges/source.js";
import { getSpecialMaxPoints, getSpecialMinPoints } from "../../helpers.js";

/** A type representing the different range brackets */
export enum RangeBracket {
  POINT_BLANK,
  SHORT,
  MEDIUM,
  LONG,
  OUT_OF_RANGE
}

/**
 * Get the ranges of the weapon as a displayable string.
 * @param weaponData - the data of the weapon to get the ranges from
 * @param specials - the Specials of the actor, owning the weapon
 */
export function getDisplayRanges(
  weaponData: WeaponDataProperties["data"],
  specials?: Partial<Specials>
): string {
  const ranges = [weaponData.ranges.short.distance];
  if (weaponData.ranges.medium) {
    ranges.push(weaponData.ranges.medium.distance);
  }
  if (weaponData.ranges.long) {
    ranges.push(weaponData.ranges.long.distance);
  }
  return ranges
    .map((range) => getDisplayRangeDistance(range, specials))
    .join("/");
}

/**
 * Get the displayable distance for a range distance. If the distance is Special
 * based and no Special was passed, the range will be returned as a minimum and
 * maximum, separated by a dash.
 * @param distance - the range distance source data
 * @param specials - the Specials of the actor, owning the weapon
 * @returns the displayable distance
 */
export function getDisplayRangeDistance(
  distance: Distance,
  specials?: Partial<Specials> | undefined
): string {
  if (typeof distance === "number") return distance.toString();
  if (distance === "melee") return "0";

  const specialValue = (specials ?? {})[distance.special];
  if (typeof specialValue === "number") {
    return getSpecialRangeDistance(distance, specialValue).toString();
  } else {
    return [
      getSpecialRangeDistance(distance, getSpecialMinPoints()),
      getSpecialRangeDistance(distance, getSpecialMaxPoints())
    ].join("-");
  }
}

/**
 * Get the effective distance for a range distance. If the distance is Special
 * based and no Special was passed, the Special multiplier portion of the
 * distance will be 0.
 * @param distance - the range distance source data
 * @param specials - the Specials of the actor, owning the weapon
 * @returns the effective distance
 */
export function getEffectiveRangeDistance(
  distance: Distance,
  specials?: Partial<Specials>
): number {
  if (typeof distance === "number") return distance;
  if (distance === "melee") return 0;

  const specialValue = (specials ?? {})[distance.special] ?? 0;
  return getSpecialRangeDistance(distance, specialValue);
}

/**
 * Get the range bracket for the given range.
 * @param ranges - the ranges to consult
 * @param range - the range to get the bracket for
 * @param specials - the Specials of the actor to consult for Special ranges
 * @returns the range bracket
 */
export function getRangeBracket(
  ranges: Ranges,
  range: number,
  specials?: Partial<Specials>
): RangeBracket {
  if (range <= CONSTANTS.rules.pointBlank.distance)
    return RangeBracket.POINT_BLANK;

  if (range <= getEffectiveRangeDistance(ranges.short.distance, specials))
    return RangeBracket.SHORT;

  if (
    ranges.medium &&
    range <= getEffectiveRangeDistance(ranges.medium.distance, specials)
  )
    return RangeBracket.MEDIUM;

  if (
    ranges.long &&
    range <= getEffectiveRangeDistance(ranges.long.distance, specials)
  )
    return RangeBracket.LONG;

  return RangeBracket.OUT_OF_RANGE;
}

/**
 * Get the modifier for the given range bracket.
 * @param ranges - the ranges to consult
 * @param rangeBracket - the range bracket to get the modifier for
 * @param usesPointBlank - whether the weapon uses the point-blank range
 * @returns the modifier for the range (0, if out of range)
 */
export function getRangeModifier(
  ranges: Ranges,
  rangeBracket: RangeBracket,
  usesPointBlank = false
): number {
  if (usesPointBlank && rangeBracket <= RangeBracket.POINT_BLANK)
    return CONSTANTS.rules.pointBlank.modifier;

  if (rangeBracket <= RangeBracket.SHORT) return ranges.short.modifier;

  if (ranges.medium && rangeBracket <= RangeBracket.MEDIUM)
    return ranges.medium.modifier;

  if (ranges.long && rangeBracket <= RangeBracket.LONG)
    return ranges.long.modifier;

  return 0;
}

/**
 * Get the effective distance for a Special based range distance.
 * @param distance - the Special based distance
 * @param specialValue - the value of the Special to use
 * @returns the effective distance
 */
export function getSpecialRangeDistance(
  distance: SpecialBasedRange,
  specialValue: number
): number {
  return distance.base + specialValue * distance.multiplier;
}

/** Get the names of SPECIALs used in the Ranges. */
export function getRangesSpecials(ranges: Ranges): Set<SpecialName> {
  const specialNames: Set<SpecialName> = new Set();

  [
    ranges.short.distance,
    ranges.medium?.distance,
    ranges.long?.distance
  ].forEach((distance) => {
    if (typeof distance === "object") specialNames.add(distance.special);
  });

  return specialNames;
}
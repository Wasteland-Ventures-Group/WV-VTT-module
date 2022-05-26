import { CONSTANTS, SpecialName } from "../../constants.js";
import type SpecialsProperties from "../../data/actor/character/specials/properties.js";
import type WeaponDataProperties from "../../data/item/weapon/properties.js";
import type RangesProperties from "../../data/item/weapon/ranges/properties.js";
import type { DistanceProperties } from "../../data/item/weapon/ranges/properties.js";
import type RangesSource from "../../data/item/weapon/ranges/source.js";

/** A type representing the different range brackets */
export enum RangeBracket {
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
  specials?: Partial<SpecialsProperties>
): string {
  return [
    weaponData.ranges.short.distance,
    weaponData.ranges.medium.distance,
    weaponData.ranges.long.distance
  ]
    .map((range) => getDisplayRangeDistance(range, specials))
    .join("/");
}

/**
 * Get the displayable distance for a range distance. If the distance is Special
 * based and no Special was passed, the range will be returned as a minimum and
 * maximum, separated by a dash. If the base distance is zero and either one of
 * the special distance components is not set, this returns a single dash.
 * @param distance - the range distance source data
 * @param specials - the Specials of the actor, owning the weapon
 * @returns the displayable distance
 */
export function getDisplayRangeDistance(
  distance: DistanceProperties,
  specials?: Partial<SpecialsProperties> | undefined
): string {
  if (distance.multiplier.total !== 0 && distance.special !== "") {
    const specialValue = (specials ?? {})[distance.special]?.tempTotal;
    if (typeof specialValue === "number") {
      return getSpecialRangeDistance(distance, specialValue).toString();
    } else {
      return [
        getSpecialRangeDistance(distance, CONSTANTS.bounds.special.points.min),
        getSpecialRangeDistance(distance, CONSTANTS.bounds.special.points.max)
      ].join("-");
    }
  }

  if (distance.base.total === 0) return "-";

  return distance.base.total.toString();
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
  distance: DistanceProperties,
  specials?: Partial<SpecialsProperties>
): number {
  if (distance.multiplier.total !== 0 && distance.special !== "") {
    const specialValue = (specials ?? {})[distance.special]?.tempTotal ?? 0;
    return getSpecialRangeDistance(distance, specialValue);
  }

  return distance.base.total;
}

/**
 * Get the range bracket for the given range.
 * @param ranges - the ranges to consult
 * @param range - the range to get the bracket for
 * @param specials - the Specials of the actor to consult for Special ranges
 * @returns the range bracket
 */
export function getRangeBracket(
  ranges: RangesProperties,
  range: number,
  specials?: Partial<SpecialsProperties>
): RangeBracket {
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
 * @returns the modifier for the range (0, if out of range)
 */
export function getRangeModifier(
  ranges: RangesProperties,
  rangeBracket: RangeBracket
): number {
  if (rangeBracket <= RangeBracket.SHORT) return ranges.short.modifier.total;

  if (ranges.medium && rangeBracket <= RangeBracket.MEDIUM)
    return ranges.medium.modifier.total;

  if (ranges.long && rangeBracket <= RangeBracket.LONG)
    return ranges.long.modifier.total;

  return 0;
}

/**
 * Get the effective distance for a Special based range distance.
 * @param distance - the Special based distance
 * @param specialValue - the value of the Special to use
 * @returns the effective distance
 */
export function getSpecialRangeDistance(
  distance: DistanceProperties,
  specialValue: number
): number {
  return distance.base.total + distance.multiplier.total * specialValue;
}

/** Get the names of SPECIALs used in the Ranges. */
export function getRangesSpecials(ranges: RangesSource): Set<SpecialName> {
  const specialNames: Set<SpecialName> = new Set();

  [ranges.short.distance, ranges.medium.distance, ranges.long.distance].forEach(
    (distance) => {
      if (distance.special !== "") specialNames.add(distance.special);
    }
  );

  return specialNames;
}

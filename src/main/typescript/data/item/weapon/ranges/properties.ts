import type WvActor from "../../../../actor/wvActor.js";
import { CONSTANTS, RangeBracket, TAGS } from "../../../../constants.js";
import type SpecialsProperties from "../../../actor/character/specials/properties.js";
import { CompositeNumber } from "../../../common.js";
import type { RangesSource, DistanceSource, RangeSource } from "./source.js";

export type RangesProperties = RangesSource & {
  short: RangeProperties;

  medium: RangeProperties;

  long: RangeProperties;
};

export const RangesProperties = {
  transform(source: RangesSource): RangesProperties {
    const short = RangeProperties.transform(source.short);
    const medium = RangeProperties.transform(source.medium);
    const long = RangeProperties.transform(source.long);
    return {
      ...source,
      short,
      medium,
      long
    };
  },

  /** Get all ranges matching the given tags. */
  getMatching(
    rangesProperties: RangesProperties,
    tags: string[] | undefined
  ): RangeProperties[] {
    const rp = rangesProperties;
    return [rp.short, rp.medium, rp.long].filter((range) =>
      RangeProperties.matches(range, tags)
    );
  },

  /**
   * Get the range bracket for the given distance in meters.
   * @param distance - the distance in meters to get the bracket for
   * @param tags - potential range picking relevant tags
   * @param specials - the Specials of the actor to consult for Special ranges
   * @returns the range bracket
   */
  getRangeBracket(
    rangesProperties: RangesProperties,
    distance: number,
    tags: string[],
    specials?: Partial<SpecialsProperties>
  ): RangeBracket {
    const rp = rangesProperties;
    if (
      RangeProperties.matches(rp.short, tags) &&
      distance <=
        DistanceProperties.getEffectiveRangeDistance(
          rp.short.distance,
          specials
        )
    )
      return RangeBracket.SHORT;

    if (
      RangeProperties.matches(rp.medium, tags) &&
      distance <=
        DistanceProperties.getEffectiveRangeDistance(
          rp.medium.distance,
          specials
        )
    )
      return RangeBracket.MEDIUM;

    if (
      RangeProperties.matches(rp.long, tags) &&
      distance <=
        DistanceProperties.getEffectiveRangeDistance(rp.long.distance, specials)
    )
      return RangeBracket.LONG;

    return RangeBracket.OUT_OF_RANGE;
  },

  /**
   * Get the modifier for the given range bracket.
   * @param rangeBracket - the range bracket to get the modifier for
   * @returns the modifier for the range (0, if out of range)
   */
  getRangeModifier(
    rangesProperties: RangesProperties,
    rangeBracket: RangeBracket
  ): number {
    const rp = rangesProperties;
    if (rangeBracket <= RangeBracket.SHORT) return rp.short.modifier.total;

    if (rangeBracket <= RangeBracket.MEDIUM) return rp.medium.modifier.total;

    if (rangeBracket <= RangeBracket.LONG) return rp.long.modifier.total;

    return 0;
  },

  /**
   * Get the ranges of the weapon as a displayable string.
   * @param tags - potential range picking relevant tags
   * @param specials - the Specials of the actor, owning the weapon
   */
  getDisplayRanges(
    rangesProperties: RangesProperties,
    tags: string[],
    specials?: Partial<SpecialsProperties>
  ): string {
    return RangesProperties.getMatching(rangesProperties, tags)
      .map((range) =>
        DistanceProperties.getDisplayRangeDistance(range.distance, specials)
      )
      .join("/");
  },

  /**
   * Apply a size category based reach bonus to the appropriate range distances.
   */
  applySizeCategoryReachBonus(
    rangesProperties: RangesProperties,
    actor: WvActor | null
  ): void {
    if (!actor) return;

    this.getMatching(rangesProperties, [TAGS.sizeCategoryReachBonus]).forEach(
      (range) =>
        DistanceProperties.applySizeCategoryReachBonus(
          range.distance,
          actor.data.data.background.size.total
        )
    );
  }
};

export type RangeProperties = RangeSource & {
  distance: DistanceProperties;
  modifier: CompositeNumber;
};

export const RangeProperties = {
  transform(source: RangeSource): RangeProperties {
    const distance = DistanceProperties.transform(source.distance);
    const modifier = CompositeNumber.from(source.modifier);
    return {
      ...source,
      distance,
      modifier
    };
  },

  /** Check whether this range matches the given list of tags. */
  matches(
    rangeProperties: RangeProperties,
    tags: string[] | undefined
  ): boolean {
    if (tags === undefined) return true;

    return !tags.some((tag) => !rangeProperties.tags.includes(tag));
  }
};

export type DistanceProperties = DistanceSource & {
  base: CompositeNumber;

  multiplier: CompositeNumber;
};

export const DistanceProperties = {
  transform(source: DistanceSource): DistanceProperties {
    const base = CompositeNumber.from(source.base);
    base.bounds.min = 0;

    const multiplier = CompositeNumber.from(source.multiplier);
    multiplier.bounds.min = 0;
    return {
      ...source,
      base,
      multiplier
    };
  },

  /**
   * Get the effective distance for a range distance. If the distance is Special
   * based and no Special was passed, the Special multiplier portion of the
   * distance will be 0.
   * @param specials - the Specials of the actor, owning the weapon
   * @returns the effective distance
   */
  getEffectiveRangeDistance(
    distanceProperties: DistanceProperties,
    specials?: Partial<SpecialsProperties>
  ): number {
    if (
      distanceProperties.multiplier.total !== 0 &&
      distanceProperties.special !== ""
    ) {
      const specialValue =
        (specials ?? {})[distanceProperties.special]?.tempTotal ?? 0;
      return DistanceProperties.getSpecialRangeDistance(
        distanceProperties,
        specialValue
      );
    }

    return distanceProperties.base.total;
  },

  /**
   * Get the displayable distance for a range distance. If the distance is
   * Special based and no Special was passed, the range will be returned as a
   * minimum and maximum, separated by a dash. If the base distance is zero and
   * either one of the Special distance components is not set, this returns a
   * single dash.
   * @param specials - the Specials of the actor, owning the weapon
   * @returns the displayable distance
   */
  getDisplayRangeDistance(
    distanceProperties: DistanceProperties,
    specials?: Partial<SpecialsProperties> | undefined
  ): string {
    if (
      distanceProperties.multiplier.total !== 0 &&
      distanceProperties.special !== ""
    ) {
      const specialValue = (specials ?? {})[distanceProperties.special]
        ?.tempTotal;
      if (typeof specialValue === "number") {
        return this.getSpecialRangeDistance(
          distanceProperties,
          specialValue
        ).toString();
      } else {
        return [
          this.getSpecialRangeDistance(
            distanceProperties,
            CONSTANTS.bounds.special.value.min
          ),
          this.getSpecialRangeDistance(
            distanceProperties,
            CONSTANTS.bounds.special.value.max
          )
        ].join("-");
      }
    }

    if (distanceProperties.base.total === 0) return "-";

    return distanceProperties.base.total.toString();
  },

  /**
   * Apply a base distance bonus to the distance based on the given size
   * category.
   */
  applySizeCategoryReachBonus(
    distanceProperties: DistanceProperties,
    sizeCategory: number
  ) {
    const value = DistanceProperties.getSizeCategoryReachBonus(sizeCategory);
    if (value)
      distanceProperties.base.add({
        value,
        labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
      });
  },

  /** Get the size category based reach bonus for the given size category. */
  getSizeCategoryReachBonus(sizeCategory: number): number {
    switch (sizeCategory) {
      case 2:
        return 2;
      case 3:
        return 4;
      case 4:
        return 10;
      default:
        return 0;
    }
  },

  /**
   * Get the effective distance for a Special based range distance.
   * @param specialValue - the value of the Special to use
   * @returns the effective distance
   */
  getSpecialRangeDistance(
    distanceProperties: DistanceProperties,
    specialValue: number
  ): number {
    return (
      distanceProperties.base.total +
      distanceProperties.multiplier.total * specialValue
    );
  }
};

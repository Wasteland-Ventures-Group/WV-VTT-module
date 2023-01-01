import type WvActor from "../../../../actor/wvActor.js";
import { CONSTANTS, RangeBracket, TAGS } from "../../../../constants.js";
import type { SpecialsProperties } from "../../../actor/character/specials/properties.js";
import { CompositeNumber } from "../../../common.js";
import type { RangesSource, DistanceSource, RangeSource } from "./source.js";

export type RangesProperties = RangesSource & {
  short: RangeProperties;

  medium: RangeProperties;

  long: RangeProperties;

  /** Get all ranges matching the given tags. */
  getMatching(tags: string[] | undefined): RangeProperties[];

  /**
   * Get the range bracket for the given distance in meters.
   * @param distance - the distance in meters to get the bracket for
   * @param tags - potential range picking relevant tags
   * @param specials - the Specials of the actor to consult for Special ranges
   * @returns the range bracket
   */
  getRangeBracket(
    distance: number,
    tags: string[],
    specials?: Partial<SpecialsProperties>
  ): RangeBracket;

  /**
   * Get the modifier for the given range bracket.
   * @param rangeBracket - the range bracket to get the modifier for
   * @returns the modifier for the range (0, if out of range)
   */
  getRangeModifier(rangeBracket: RangeBracket): number;

  /**
   * Get the ranges of the weapon as a displayable string.
   * @param tags - potential range picking relevant tags
   * @param specials - the Specials of the actor, owning the weapon
   */
  getDisplayRanges(
    tags: string[],
    specials?: Partial<SpecialsProperties>
  ): string;

  /**
   * Apply a size category based reach bonus to the appropriate range distances.
   */
  applySizeCategoryReachBonus(actor: WvActor | null): void;
};

export const RangesProperties = {
  from(source: RangesSource): RangesProperties {
    const short = RangeProperties.from(source.short);
    const medium = RangeProperties.from(source.medium);
    const long = RangeProperties.from(source.long);
    return {
      ...source,
      short,
      medium,
      long,
      getMatching(tags: string[] | undefined): RangeProperties[] {
        return [this.short, this.medium, this.long].filter((range) =>
          range.matches(tags)
        );
      },
      getRangeBracket(
        distance: number,
        tags: string[],
        specials?: Partial<SpecialsProperties>
      ): RangeBracket {
        if (
          this.short.matches(tags) &&
          distance <= this.short.distance.getEffectiveRangeDistance(specials)
        )
          return RangeBracket.SHORT;

        if (
          this.medium.matches(tags) &&
          distance <= this.medium.distance.getEffectiveRangeDistance(specials)
        )
          return RangeBracket.MEDIUM;

        if (
          this.long.matches(tags) &&
          distance <= this.long.distance.getEffectiveRangeDistance(specials)
        )
          return RangeBracket.LONG;

        return RangeBracket.OUT_OF_RANGE;
      },
      getRangeModifier(rangeBracket: RangeBracket): number {
        if (rangeBracket <= RangeBracket.SHORT)
          return this.short.modifier.total;

        if (rangeBracket <= RangeBracket.MEDIUM)
          return this.medium.modifier.total;

        if (rangeBracket <= RangeBracket.LONG) return this.long.modifier.total;

        return 0;
      },

      getDisplayRanges(
        tags: string[],
        specials?: Partial<SpecialsProperties>
      ): string {
        return this.getMatching(tags)
          .map((range) => range.distance.getDisplayRangeDistance(specials))
          .join("/");
      },

      /**
       * Apply a size category based reach bonus to the appropriate range distances.
       */
      applySizeCategoryReachBonus(actor: WvActor | null): void {
        if (!actor) return;

        this.getMatching([TAGS.sizeCategoryReachBonus]).forEach((range) =>
          range.distance.applySizeCategoryReachBonus(
            actor.data.data.background.size.total
          )
        );
      }
    };
  }
};

export type RangeProperties = RangeSource & {
  distance: DistanceProperties;

  modifier: CompositeNumber;

  /** Check whether this range matches the given list of tags. */
  matches(tags: string[] | undefined): boolean;
};

export const RangeProperties = {
  from(source: RangeSource): RangeProperties {
    const distance = DistanceProperties.from(source.distance);
    const modifier = CompositeNumber.from(source.modifier);
    return {
      ...source,
      distance,
      modifier,
      matches(tags: string[] | undefined): boolean {
        if (tags === undefined) return true;

        return !tags.some((tag) => !this.tags.includes(tag));
      }
    };
  }
};

export type DistanceProperties = DistanceSource & {
  base: CompositeNumber;

  multiplier: CompositeNumber;

  /**
   * Get the effective distance for a range distance. If the distance is Special
   * based and no Special was passed, the Special multiplier portion of the
   * distance will be 0.
   * @param specials - the Specials of the actor, owning the weapon
   * @returns the effective distance
   */
  getEffectiveRangeDistance(specials?: Partial<SpecialsProperties>): number;
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
    specials?: Partial<SpecialsProperties> | undefined
  ): string;
  /**
   * Apply a base distance bonus to the distance based on the given size
   * category.
   */
  applySizeCategoryReachBonus(sizeCategory: number): void;

  /** Get the size category based reach bonus for the given size category. */
  getSizeCategoryReachBonus(sizeCategory: number): number;

  /**
   * Get the effective distance for a Special based range distance.
   * @param specialValue - the value of the Special to use
   * @returns the effective distance
   */
  getSpecialRangeDistance(specialValue: number): number;
};

export const DistanceProperties = {
  from(source: DistanceSource): DistanceProperties {
    const base = CompositeNumber.from(source.base);
    base.bounds.min = 0;

    const multiplier = CompositeNumber.from(source.multiplier);
    multiplier.bounds.min = 0;
    return {
      ...source,
      base,
      multiplier,
      getEffectiveRangeDistance(
        specials?: Partial<SpecialsProperties>
      ): number {
        if (this.multiplier.total !== 0 && this.special !== "") {
          const specialValue = (specials ?? {})[this.special]?.tempTotal ?? 0;
          return this.getSpecialRangeDistance(specialValue);
        }

        return this.base.total;
      },
      getDisplayRangeDistance(
        specials?: Partial<SpecialsProperties> | undefined
      ): string {
        if (this.multiplier.total !== 0 && this.special !== "") {
          const specialValue = (specials ?? {})[this.special]?.tempTotal;
          if (typeof specialValue === "number") {
            return this.getSpecialRangeDistance(specialValue).toString();
          } else {
            return [
              this.getSpecialRangeDistance(CONSTANTS.bounds.special.value.min),
              this.getSpecialRangeDistance(CONSTANTS.bounds.special.value.max)
            ].join("-");
          }
        }

        if (this.base.total === 0) return "-";

        return this.base.total.toString();
      },
      applySizeCategoryReachBonus(sizeCategory: number) {
        const value = this.getSizeCategoryReachBonus(sizeCategory);
        if (value)
          this.base.add({
            value,
            labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
          });
      },
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
      getSpecialRangeDistance(specialValue: number): number {
        return this.base.total + this.multiplier.total * specialValue;
      }
    };
  }
};

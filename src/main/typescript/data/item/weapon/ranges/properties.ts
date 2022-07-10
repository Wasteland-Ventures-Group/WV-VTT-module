import { CONSTANTS, RangeBracket } from "../../../../constants.js";
import type SpecialsProperties from "../../../actor/character/specials/properties.js";
import { CompositeNumber } from "../../../common.js";
import RangesSource, { DistanceSource, RangeSource } from "./source.js";

export default class RangesProperties extends RangesSource {
  constructor(source: RangesSource) {
    super();
    this.short = new RangeProperties(source.short);
    this.medium = new RangeProperties(source.medium);
    this.long = new RangeProperties(source.long);
  }

  override short: RangeProperties;

  override medium: RangeProperties;

  override long: RangeProperties;

  /**
   * Get the range bracket for the given distance in meters.
   * @param distance - the distance in meters to get the bracket for
   * @param specials - the Specials of the actor to consult for Special ranges
   * @returns the range bracket
   */
  getRangeBracket(
    distance: number,
    specials?: Partial<SpecialsProperties>
  ): RangeBracket {
    if (distance <= this.short.distance.getEffectiveRangeDistance(specials))
      return RangeBracket.SHORT;

    if (distance <= this.medium.distance.getEffectiveRangeDistance(specials))
      return RangeBracket.MEDIUM;

    if (distance <= this.long.distance.getEffectiveRangeDistance(specials))
      return RangeBracket.LONG;

    return RangeBracket.OUT_OF_RANGE;
  }

  /**
   * Get the modifier for the given range bracket.
   * @param rangeBracket - the range bracket to get the modifier for
   * @returns the modifier for the range (0, if out of range)
   */
  getRangeModifier(rangeBracket: RangeBracket): number {
    if (rangeBracket <= RangeBracket.SHORT) return this.short.modifier.total;

    if (rangeBracket <= RangeBracket.MEDIUM) return this.medium.modifier.total;

    if (rangeBracket <= RangeBracket.LONG) return this.long.modifier.total;

    return 0;
  }

  /**
   * Get the ranges of the weapon as a displayable string.
   * @param specials - the Specials of the actor, owning the weapon
   */
  getDisplayRanges(specials?: Partial<SpecialsProperties>): string {
    return [this.short.distance, this.medium.distance, this.long.distance]
      .map((distance) => distance.getDisplayRangeDistance(specials))
      .join("/");
  }
}

export class RangeProperties extends RangeSource {
  constructor(source: RangeSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.distance = new DistanceProperties(source.distance);
    this.modifier = CompositeNumber.from(source.modifier);
  }

  override distance: DistanceProperties;

  override modifier: CompositeNumber;
}

export class DistanceProperties extends DistanceSource {
  constructor(source: DistanceSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.base = CompositeNumber.from(source.base);
    this.multiplier = CompositeNumber.from(source.multiplier);
  }

  override base: CompositeNumber;

  override multiplier: CompositeNumber;

  /**
   * Get the effective distance for a range distance. If the distance is Special
   * based and no Special was passed, the Special multiplier portion of the
   * distance will be 0.
   * @param specials - the Specials of the actor, owning the weapon
   * @returns the effective distance
   */
  getEffectiveRangeDistance(specials?: Partial<SpecialsProperties>): number {
    if (this.multiplier.total !== 0 && this.special !== "") {
      const specialValue = (specials ?? {})[this.special]?.tempTotal ?? 0;
      return this.getSpecialRangeDistance(specialValue);
    }

    return this.base.total;
  }

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
  ): string {
    if (this.multiplier.total !== 0 && this.special !== "") {
      const specialValue = (specials ?? {})[this.special]?.tempTotal;
      if (typeof specialValue === "number") {
        return this.getSpecialRangeDistance(specialValue).toString();
      } else {
        return [
          this.getSpecialRangeDistance(CONSTANTS.bounds.special.points.min),
          this.getSpecialRangeDistance(CONSTANTS.bounds.special.points.max)
        ].join("-");
      }
    }

    if (this.base.total === 0) return "-";

    return this.base.total.toString();
  }

  /**
   * Get the effective distance for a Special based range distance.
   * @param specialValue - the value of the Special to use
   * @returns the effective distance
   */
  private getSpecialRangeDistance(specialValue: number): number {
    return this.base.total + this.multiplier.total * specialValue;
  }
}

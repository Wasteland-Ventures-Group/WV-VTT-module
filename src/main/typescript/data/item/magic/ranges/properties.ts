import type { SpellRange, SplashSize } from "../../../../constants";
import { CompositeNumber } from "../../../common";
import type { RangeSource } from "./source";

export default class RangeProperties implements RangeSource {
  constructor(source: RangeSource) {
    this.distanceBase = CompositeNumber.from(source.distanceBase);
    this.distanceBase.bounds.min = 0;

    this.distanceScale = CompositeNumber.from(source.distanceScale);
    this.distanceScale.bounds.min = 0;
    this.type = source.type;
    this.splashSize = source.splashSize;
    this.description = source.description;
  }

  distanceBase: CompositeNumber;

  distanceScale: CompositeNumber;

  type: SpellRange;

  splashSize: SplashSize;

  description: string;
}

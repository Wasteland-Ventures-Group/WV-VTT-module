import { CompositeNumber } from "../../../common";
import { RangeSource } from "./source";

export default class RangeProperties extends RangeSource {
  constructor(source: RangeSource) {
    super();

    this.distanceBase = CompositeNumber.from(source.distanceBase);
    this.distanceBase.bounds.min = 0;

    this.distanceScale = CompositeNumber.from(source.distanceScale);
    this.distanceScale.bounds.min = 0;
  }

  override distanceBase: CompositeNumber;

  override distanceScale: CompositeNumber;
}

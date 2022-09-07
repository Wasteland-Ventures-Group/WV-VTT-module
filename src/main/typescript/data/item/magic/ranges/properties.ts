import { CompositeNumber } from "../../../common";
import { RangeSource } from "./source";

export default class RangeProperties extends RangeSource {
  constructor(source: RangeSource) {
    super();
    this.distanceBase = CompositeNumber.from(source.distanceBase);
    this.distanceScale = CompositeNumber.from(source.distanceScale);
  }

  override distanceBase: CompositeNumber;

  override distanceScale: CompositeNumber;
}

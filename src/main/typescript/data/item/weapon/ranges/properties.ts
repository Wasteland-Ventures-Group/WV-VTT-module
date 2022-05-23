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
}

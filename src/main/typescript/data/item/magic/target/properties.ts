import { CompositeNumber } from "../../../common";
import { TargetSource } from "./source";

export default class TargetProperties extends TargetSource {
  constructor(source: TargetSource) {
    super();

    this.count = CompositeNumber.from(source.count);
    this.count.bounds.min = 0;
  }

  override count: CompositeNumber;
}

import { CompositeNumber } from "../../../common";
import { TargetSource } from "./source";

export class TargetProperties extends TargetSource {
  constructor(source: TargetSource) {
    super();
    this.count = CompositeNumber.from(source.count);
  }

  override count: CompositeNumber;
}

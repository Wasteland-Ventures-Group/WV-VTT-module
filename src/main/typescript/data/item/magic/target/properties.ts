import type { SplashSize, TargetType } from "../../../../constants";
import { CompositeNumber } from "../../../common";
import type { TargetSource, AOETypes } from "./source";

export default class TargetProperties implements TargetSource {
  constructor(source: TargetSource) {
    this.count = CompositeNumber.from(source.count);
    this.count.bounds.min = 0;
    this.type = source.type;
    this.aoeType = source.aoeType;
    this.fixedAoE = source.fixedAoE;
  }

  count: CompositeNumber;

  type: TargetType;

  aoeType: typeof AOETypes[number];

  fixedAoE: SplashSize;
}

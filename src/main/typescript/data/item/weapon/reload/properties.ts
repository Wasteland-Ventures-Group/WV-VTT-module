import { CompositeNumber } from "../../../common.js";
import ReloadSource from "./source.js";

export default class ReloadProperties extends ReloadSource {
  constructor(source: ReloadSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.ap = CompositeNumber.from(source.ap);
    this.size = CompositeNumber.from(source.size);
  }

  override ap: CompositeNumber;

  override size: CompositeNumber;
}

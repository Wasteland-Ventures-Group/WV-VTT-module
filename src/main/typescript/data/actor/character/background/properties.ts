import { CompositeNumber } from "../../../common.js";
import BackgroundSource from "./source.js";

export default class BackgroundProperties extends BackgroundSource {
  constructor(source: BackgroundSource) {
    super();
    foundry.utils.mergeObject(this, source);

    this.size = CompositeNumber.from(source.size);
    this.size.bounds = { min: -4, max: 4 };
  }

  override size: CompositeNumber;
}

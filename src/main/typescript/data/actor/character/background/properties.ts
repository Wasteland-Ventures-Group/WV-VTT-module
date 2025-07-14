import { CompositeNumber } from "../../../common.js";
import { type BackgroundSource } from "./source.js";

export type BackgroundProperties = BackgroundSource & {
  size: CompositeNumber;
}

export namespace BackgroundProperties {
  export function from(source: BackgroundSource): BackgroundProperties {
    const result = { ...source, size: CompositeNumber.from(source.size) }
    result.size.bounds = { min: -4, max: 4 }
    return result
  }
}

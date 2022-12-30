import { CompositeNumber } from "../../../common.js";
import type { BackgroundSource } from "./source.js";

export type BackgroundProperties = BackgroundSource & {
  size: CompositeNumber;
};

export const BackgroundProperties = {
  from(source: BackgroundSource): BackgroundProperties {
    const size = CompositeNumber.from(source.size);
    size.bounds = { min: -4, max: 4 };

    return {
      ...source,
      size
    };
  }
};

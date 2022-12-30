import { CompositeNumber } from "../../../common.js";
import type { ReloadSource } from "./source.js";

export type ReloadProperties = ReloadSource & {
  ap: CompositeNumber;
  size: CompositeNumber;
};

export const ReloadProperties = {
  from(source: ReloadSource): ReloadProperties {
    const ap = CompositeNumber.from(source.ap);
    ap.bounds.min = 0;

    const size = CompositeNumber.from(source.size);
    size.bounds.min = 0;

    return {
      ...source,
      ap,
      size
    };
  }
};

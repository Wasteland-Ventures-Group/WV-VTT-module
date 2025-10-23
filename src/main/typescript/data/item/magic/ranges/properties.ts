import { CompositeNumber } from "../../../common";
import fields = foundry.data.fields;
import type { RANGE_SCHEMA } from "./source";

type RangeSource = fields.SchemaField.InitializedData<typeof RANGE_SCHEMA>;
export type RangeProperties = RangeSource & {
  distanceBase: CompositeNumber;
  distanceScale: CompositeNumber;
};

export namespace RangeProperties {
  export function from(s: RangeSource): RangeProperties {
    const distanceBase = CompositeNumber.from(s.distanceBase);
    distanceBase.bounds.min = 0;

    const distanceScale = CompositeNumber.from(s.distanceScale);
    distanceScale.bounds.min = 0;
    return {
      ...s,
      distanceScale, distanceBase,
    }
  }
}

import type WvItem from "../../../../item/wvItem.js";
import { CompositeNumber } from "../../../common.js";
import { BaseItemProperties } from "../baseItem/properties.js";
import { type PhysicalItemSource } from "./source.js";

/**
 * This holds the properties of the base values that all physical items have in
 * common.
 */
export type PhysicalItemProperties = PhysicalItemSource & BaseItemProperties & {
  value: CompositeNumber;
  weight: CompositeNumber;
}

export namespace PhysicalItemProperties {
  export function from(s: PhysicalItemSource, owningItem: WvItem): PhysicalItemProperties {
    const value = CompositeNumber.from(s.value);
    value.bounds.min = 0;
    const weight = CompositeNumber.from(s.weight);
    weight.bounds.min = 0;
    const base = BaseItemProperties.from(s, owningItem);
    const result = {
      ...s,
      ...base,
      value,
      weight,
    };

    return result
  }
}

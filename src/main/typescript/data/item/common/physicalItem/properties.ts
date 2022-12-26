import type WvItem from "../../../../item/wvItem.js";
import { CompositeNumber } from "../../../common.js";
import { BaseItemProperties } from "../baseItem/properties.js";
import type { PhysicalItemSource } from "./source.js";

/**
 * This holds the properties of the base values that all physical items have in
 * common.
 */
export type PhysicalItemProperties = PhysicalItemSource &
  BaseItemProperties & {
    value: CompositeNumber;
    weight: CompositeNumber;
  };
export const PhysicalItemProperties = {
  /**
   * Transform a PhysicalItemSource and apply it onto a PhysicalItemProperties.
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  transform(
    source: PhysicalItemSource,
    owningItem: WvItem
  ): PhysicalItemProperties {
    const baseProperties = BaseItemProperties.transform(source, owningItem);
    const value = CompositeNumber.from(source.value);
    const weight = CompositeNumber.from(source.weight);
    return {
      ...source,
      ...baseProperties,
      value,
      weight
    };
  }
};

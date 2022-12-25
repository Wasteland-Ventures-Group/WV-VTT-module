import type WvItem from "../../../../item/wvItem.js";
import type { CompositeNumber } from "../../../common.js";
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
  transform(source: PhysicalItemSource, owningItem: WvItem) {
    const baseProperties = BaseItemProperties.transform(source, owningItem);
    return {
      ...source,
      baseProperties
    };
  }
};

import type WvItem from "../../../../item/wvItem.js";
import { PhysicalItemProperties } from "../physicalItem/properties.js";
import type StackableItemSource from "./source.js";

/**
 * This holds the properties of the base values that all stackable physical
 * items have in common.
 */
export type StackableItemProperties = StackableItemSource &
  PhysicalItemProperties;

export const StackableItemSource = {
  /**
   * Transform a StackableItemSource and apply it onto a
   * StackableItemProperties.
   * @param target - the target to transform onto
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  transform(source: StackableItemSource, owningItem: WvItem) {
    const baseProperties = PhysicalItemProperties.transform(source, owningItem);
    return {
      ...baseProperties
    };
  }
};

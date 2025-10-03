import type WvItem from "../../../../item/wvItem.js";
import { PhysicalItemProperties } from "../physicalItem/properties.js";
import { type StackableItemSource } from "./source.js";


/**
 * This holds the properties of the base values that all stackable physical
 * items have in common.
 */
export type StackableItemProperties = StackableItemSource & PhysicalItemProperties;

export namespace StackableItemProperties {
  /**
   * Transform a StackableItemSource and apply it onto a
   * StackableItemProperties.
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  export function from(s: StackableItemSource, owningItem: WvItem): StackableItemProperties {
    return {
      ...s,
      ...PhysicalItemProperties.from(s, owningItem)
    }
  }
}

import type WvItem from "../../../../item/wvItem.js";
import PhysicalItemProperties from "../physicalItem/properties.js";
import type StackableItemSource from "./source.js";

/**
 * This holds the properties of the base values that all stackable physical
 * items have in common.
 */
export default abstract class StackableItemProperties
  extends PhysicalItemProperties
  implements StackableItemSource
{
  /**
   * Transform a StackableItemSource and apply it onto a
   * StackableItemProperties.
   * @param target - the target to transform onto
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  static transform(
    target: StackableItemProperties,
    source: StackableItemSource,
    owningItem: WvItem
  ) {
    target.amount = source.amount;
    PhysicalItemProperties.transform(target, source, owningItem);
  }

  amount: number = 0;
}

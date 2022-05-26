import type WvItem from "../../../../item/wvItem.js";
import { CompositeNumber } from "../../../common.js";
import PhysicalItemProperties from "../physicalItem/properties.js";
import RulesProperties from "../rules/properties.js";
import StackableItemSource from "./source.js";

/**
 * This holds the properties of the base values that all stackable physical
 * items have in common.
 */
export default abstract class StackableItemProperties
  extends StackableItemSource
  implements PhysicalItemProperties
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
    PhysicalItemProperties.transform(target, source, owningItem);
  }

  override rules = new RulesProperties();

  override value = new CompositeNumber();

  override weight = new CompositeNumber();
}

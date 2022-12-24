import type { Rarity } from "../../../../constants.js";
import type WvItem from "../../../../item/wvItem.js";
import { CompositeNumber } from "../../../common.js";
import BaseItemProperties from "../baseItem/properties.js";
import type PhysicalItemSource from "./source.js";

/**
 * This holds the properties of the base values that all physical items have in
 * common.
 */
export default abstract class PhysicalItemProperties
  extends BaseItemProperties
  implements PhysicalItemSource
{
  /**
   * Transform a PhysicalItemSource and apply it onto a PhysicalItemProperties.
   * @param target - the target to transform onto
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  static transform(
    target: PhysicalItemProperties,
    source: PhysicalItemSource,
    owningItem: WvItem
  ) {
    BaseItemProperties.transform(target, source, owningItem);

    target.value = CompositeNumber.from(source.value);
    target.value.bounds.min = 0;

    target.weight = CompositeNumber.from(source.weight);
    target.weight.bounds.min = 0;
  }

  rarity: Rarity = "common";

  value = new CompositeNumber();

  weight = new CompositeNumber();
}

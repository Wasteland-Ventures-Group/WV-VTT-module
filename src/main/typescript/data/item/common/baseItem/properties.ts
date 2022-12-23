import type WvItem from "../../../../item/wvItem.js";
import RulesProperties from "../rules/properties.js";
import type BaseItemSource from "./source.js";

/**
 * This holds the properties of the base values that all items have in common.
 */
export default abstract class BaseItemProperties implements BaseItemSource {
  /**
   * Transform a BaseItemSource and apply it onto a BaseItemProperties.
   * @param target - the target to transform onto
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  static transform(
    target: BaseItemProperties,
    source: BaseItemSource,
    owningItem: WvItem
  ) {
    target.name = source.name;
    target.description = source.description;
    target.notes = source.notes;
    target.tags = source.tags;
    RulesProperties.transform(target.rules, source.rules, owningItem);
  }

  name: string = "";
  description: string = "";
  notes: string = "";
  tags: string[] = [];
  rules = new RulesProperties();
}

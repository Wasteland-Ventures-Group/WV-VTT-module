import type WvItem from "../../../../item/wvItem.js";
import { RulesProperties } from "../rules/properties.js";
import type BaseItemSource from "./source.js";

/**
 * This holds the properties of the base values that all items have in common.
 */
export type BaseItemProperties = BaseItemSource & {
  rules: RulesProperties;
};

export const BaseItemProperties = {
  /**
   * Transform a BaseItemSource and apply it onto a BaseItemProperties.
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  transform(source: BaseItemSource, owningItem: WvItem): BaseItemProperties {
    const rules = RulesProperties.transform(source.rules, owningItem);
    return {
      ...source,
      rules
    };
  }
};

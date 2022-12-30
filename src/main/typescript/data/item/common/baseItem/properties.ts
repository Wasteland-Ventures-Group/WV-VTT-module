import type WvItem from "../../../../item/wvItem.js";
import { RulesProperties } from "../rules/properties.js";
import type { BaseItemSource } from "./source.js";

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
  from(source: BaseItemSource, owningItem: WvItem): BaseItemProperties {
    const rules = RulesProperties.from(source.rules, owningItem);
    return {
      ...source,
      rules
    };
  }
};

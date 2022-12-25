import { getGame } from "../../../../foundryHelpers.js";
import type WvItem from "../../../../item/wvItem.js";
import type RuleElement from "../../../../ruleEngine/ruleElement.js";
import type { RulesSource } from "./source.js";

export type RulesProperties = RulesSource & {
  elements: RuleElement[];
};

export const RulesProperties = {
  /**
   * Transform a RulesSource and apply it onto a RulesProperties.
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  transform(source: RulesSource, owningItem: WvItem): RulesProperties {
    const gameElements = getGame().wv.ruleEngine.elements;
    const elements = source.sources.map(
      (ruleSource) => new gameElements[ruleSource.type](ruleSource, owningItem)
    );
    return {
      ...source,
      elements
    };
  }
};

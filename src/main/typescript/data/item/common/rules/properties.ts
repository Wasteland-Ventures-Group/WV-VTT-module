import { getGame } from "../../../../foundryHelpers.js";
import type WvItem from "../../../../item/wvItem.js";
import type RuleElement from "../../../../ruleEngine/ruleElement.js";
import { type RulesSource } from "./source.js";

export type RulesProperties = RulesSource & {
  /** The RuleElements, created from the sources */
  elements: RuleElement[]
}

export namespace RulesProperties {
  /**
   * Transform a RulesSource and apply it onto a RulesProperties.
   * @param s - the source to transform from
   * @param owningItem - the owning item
   */
  export function from(s: RulesSource, owningItem: WvItem): RulesProperties {
    const available_elements = getGame().wv.ruleEngine.elements;
    const elements: RuleElement[] = s.sources.map(
      (ruleSource) => new available_elements[ruleSource.type](ruleSource, owningItem)
    );
    return {
      ...s,
      elements,
    }
  }
}

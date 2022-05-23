import type WvItem from "../../../../item/wvItem.js";
import type RuleElement from "../../../../ruleEngine/ruleElement.js";
import { RULE_ELEMENTS } from "../../../../ruleEngine/ruleElements.js";
import RulesSource from "./source.js";

export default class RulesProperties extends RulesSource {
  /**
   * Transform a RulesSource and apply it onto a RulesProperties.
   * @param target - the target to transform onto
   * @param source - the source to transform from
   * @param owningItem - the owning item
   */
  static transform(
    target: RulesProperties,
    source: RulesSource,
    owningItem: WvItem
  ) {
    target.elements = source.sources.map(
      (ruleSource) => new RULE_ELEMENTS[ruleSource.type](ruleSource, owningItem)
    );
  }

  /** The RuleElements, created from the sources */
  elements: RuleElement[] = [];
}

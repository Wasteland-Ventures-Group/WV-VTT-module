import { getGame } from "../../../../foundryHelpers.js";
import type WvItem from "../../../../item/wvItem.js";
import type RuleElement from "../../../../ruleEngine/ruleElement.js";
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
    const elements = getGame().wv.ruleEngine.elements;
    target.elements = source.sources.map(
      (ruleSource) => new elements[ruleSource.type](ruleSource, owningItem)
    );
  }

  /** The RuleElements, created from the sources */
  elements: RuleElement[] = [];
}

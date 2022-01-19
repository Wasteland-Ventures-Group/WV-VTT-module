import type RuleElement from "../../../ruleEngine/ruleElement.js";
import RulesSource from "./source.js";

/** A RuleElements container, that can be used in different Items. */
export default class Rules extends RulesSource {
  /** The RuleElements, created from the sources */
  elements: RuleElement[] = [];
}

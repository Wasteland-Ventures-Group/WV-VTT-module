import type RuleElementSource from "../../../ruleEngine/ruleElementSource.js";

/** A RuleElements DB container, that can be used in different Items. */
export default class RulesSource {
  /** The source objects for the RuleElements */
  sources: RuleElementSource[] = [];
}

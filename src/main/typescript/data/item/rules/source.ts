import type RuleElementSource from "../../../ruleEngine/ruleElementSource.js";

/** A RuleElements DB container, that can be used in different Items. */
export class DbRules {
  /** The source objects for the RuleElements */
  sources: RuleElementSource[] = [];
}

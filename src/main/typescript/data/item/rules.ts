import type { RuleElementLike } from "../../ruleEngine/ruleElement.js";
import type RuleElementSource from "../../ruleEngine/ruleElementSource.js";

/** A RuleElements DB container, that can be used in different Items. */
export class DbRules {
  /** The source objects for the RuleElements */
  sources: RuleElementSource[] = [];
}

/** A RuleElements container, that can be used in different Items. */
export class Rules extends DbRules {
  /** The RuleElements, created from the sources */
  elements: RuleElementLike[] = [];
}

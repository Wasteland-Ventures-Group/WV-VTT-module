import type RuleElement from "../../ruleEngine/ruleElement.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElement.js";

/** A RuleElements DB container, that can be used in different Items. */
export class DbRules {
  constructor(
    /** The source objects for the RuleElements */
    public sources: RuleElementSource[] = []
  ) {}
}

/** A RuleElements container, that can be used in different Items. */
export class Rules extends DbRules {
  constructor(
    /** The source objects for the RuleElements */
    public sources: RuleElementSource[] = [],

    /** The RuleElements, created from the sources */
    public elements: RuleElement[] = []
  ) {
    super(sources);
  }
}

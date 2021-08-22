import RuleElement from "../ruleElement.js";

/**
 * A special RuleElement, that is used to represent a new RuleElement, not
 * fully set up yet.
 */
export default class NewRuleElement extends RuleElement {
  override isNew(): true {
    return true;
  }
}

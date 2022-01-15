import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about the rule element not being saved because of errors. */
export default class NotSavedMessage extends RuleElementMessage {
  constructor() {
    super("wv.system.ruleEngine.warnings.notSaved", "warning");
  }
}

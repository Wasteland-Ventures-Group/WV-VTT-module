import RuleElementMessage from "../ruleElementMessage.js";

/** An error about an unknown SPECIAL name. */
export default class WrongSpecialNameMessage extends RuleElementMessage {
  constructor() {
    super("wv.system.ruleEngine.errors.semantic.unknownSpecialName", "error");
  }
}

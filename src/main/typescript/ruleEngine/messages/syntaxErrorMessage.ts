import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

export default class SyntaxErrorMessage extends RuleElementMessage {
  constructor(
    /** The original message from JSON.parse */
    public errorMessage: string
  ) {
    super("wv.ruleEngine.errors.syntax", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      message: this.errorMessage
    });
  }
}

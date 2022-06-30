import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about a not matching target */
export default class NotMatchingTargetMessage extends RuleElementMessage {
  constructor(
    /** The path to the property */
    public propertyPath: string
  ) {
    super("wv.system.ruleEngine.errors.logical.notMatchingTarget", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, { path: this.propertyPath });
  }
}

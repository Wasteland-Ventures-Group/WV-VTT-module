import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about a not matching target */
export default class NotMatchingTargetMessage extends RuleElementMessage {
  constructor(
    /** The name of the selected document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string
  ) {
    super("wv.system.ruleEngine.errors.logical.notMatchingTarget", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath
    });
  }
}

import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

export default class NotMatchingSelectorMessage extends RuleElementMessage {
  constructor(
    /** The name of the target document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string
  ) {
    super("wv.ruleEngine.errors.logical.notMatchingSelector", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath
    });
  }
}

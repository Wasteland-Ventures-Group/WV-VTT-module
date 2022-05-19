import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong selected property type on the target */
export default class NotModifiableNumberMessage extends RuleElementMessage {
  constructor(
    /** The name of the target document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string
  ) {
    super("wv.system.ruleEngine.errors.logical.notModifiableNumber", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath
    });
  }
}

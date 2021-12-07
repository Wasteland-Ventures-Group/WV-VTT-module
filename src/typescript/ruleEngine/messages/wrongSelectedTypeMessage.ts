import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong selected property type on the target */
export default class WrongSelectedTypeMessage extends RuleElementMessage {
  constructor(
    /** The name of the target document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string,

    /** The name of the type, the property should be */
    public typeName: string
  ) {
    super("wv.ruleEngine.errors.logical.wrongSelectedType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath,
      type: this.typeName
    });
  }
}

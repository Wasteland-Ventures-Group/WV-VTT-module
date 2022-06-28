import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong targeted property type on the selected Document */
export default class NotCompositeNumberMessage extends RuleElementMessage {
  constructor(
    /** The name of the selected document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string
  ) {
    super("wv.system.ruleEngine.errors.logical.notCompositeNumber", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath
    });
  }
}

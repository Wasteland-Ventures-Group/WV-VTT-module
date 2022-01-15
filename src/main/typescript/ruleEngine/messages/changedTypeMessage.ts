import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a rule element changing the type of a property. */
export default class ChangedTypeMessage extends RuleElementMessage {
  constructor(
    /** The name of the target document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string,

    /** The name of the original type */
    public originalType: string,

    /** The name of the new type */
    public newType: string
  ) {
    super("wv.system.ruleEngine.warnings.changedType", "warning");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath,
      original: this.originalType,
      new: this.newType
    });
  }
}

import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong target property type on the selected Document */
export default class WrongTargetTypeMessage extends RuleElementMessage {
  constructor(
    /** The name of the selected document */
    public docName: string | null,

    /** The path to the property */
    public propertyPath: string,

    /** The name of the type, the property should be */
    public typeName: string
  ) {
    super("wv.system.ruleEngine.errors.logical.wrongTargetType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      name: this.docName,
      path: this.propertyPath,
      type: this.typeName
    });
  }
}

import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong field type with a replacement message */
export default class WrongTypeMessage extends RuleElementMessage {
  constructor(
    /** The path to the property */
    public instancePath: string,

    /** The name of the type, the property should be */
    public typeName: string
  ) {
    super("wv.ruleEngine.errors.semantic.wrongType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      path: this.instancePath,
      type: this.typeName
    });
  }
}

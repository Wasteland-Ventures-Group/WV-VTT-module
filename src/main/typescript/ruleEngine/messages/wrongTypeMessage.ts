import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about a wrong property type in a RuleElement source */
export default class WrongTypeMessage extends RuleElementMessage {
  constructor(
    /** The path to the property */
    public instancePath: string,

    /** The name of the type, the property should be */
    public typeName: string
  ) {
    super("wv.system.ruleEngine.errors.semantic.wrongType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      path: this.instancePath,
      type: this.typeName
    });
  }
}

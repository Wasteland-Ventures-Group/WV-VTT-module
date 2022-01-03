import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** A warning about a wrong value type in the rule */
export default class WrongValueTypeMessage extends RuleElementMessage {
  constructor(
    /** The name of the type, the value should be */
    public typeName: string
  ) {
    super("wv.ruleEngine.errors.logical.wrongValueType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      type: this.typeName
    });
  }
}

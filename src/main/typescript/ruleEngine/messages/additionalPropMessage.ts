import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about an additional property in a RuleElement source */
export default class AdditionalPropMessage extends RuleElementMessage {
  constructor(
    /** The path to the property */
    public instancePath: string,

    /** The name of the missing property */
    public propertyName: string
  ) {
    super("wv.system.ruleEngine.errors.semantic.additional", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      path: this.instancePath,
      property: this.propertyName
    });
  }
}

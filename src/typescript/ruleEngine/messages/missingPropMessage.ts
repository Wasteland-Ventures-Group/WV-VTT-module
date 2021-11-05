import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about a missing property in a RuleElement source */
export default class MissingPropMessage extends RuleElementMessage {
  constructor(
    /** The path to the property */
    public instancePath: string,

    /** The name of the missing property */
    public propertyName: string
  ) {
    super("wv.ruleEngine.errors.semantic.missing", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      path: this.instancePath,
      property: this.propertyName
    });
  }
}

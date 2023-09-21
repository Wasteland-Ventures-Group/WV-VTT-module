import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

/** An error about a missing property in a RuleElement source */
export default class MissingPropMessage extends RuleElementMessage {
  constructor(path: (string | number)[]) {
    super("wv.system.ruleEngine.errors.semantic.missing", "error");
    const pathCopy = [...path];
    this.propertyName = pathCopy.pop()?.toString() ?? "";
    this.instancePath = pathCopy.join(".");
  }

  /** The path to the property */
  instancePath: string;

  /** The name of the missing property */
  propertyName: string;

  override get message(): string {
    return getGame().i18n.format(this.messageKey, {
      path: this.instancePath,
      property: this.propertyName
    });
  }
}

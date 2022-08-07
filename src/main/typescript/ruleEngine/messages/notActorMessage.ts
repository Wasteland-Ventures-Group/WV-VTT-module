import { getGame } from "../../foundryHelpers.js";
import RuleElementMessage from "../ruleElementMessage.js";

export default class NotActorMessage extends RuleElementMessage {
  constructor() {
    super("wv.system.ruleEngine.errors.logical.wrongDocumentType", "error");
  }

  override get message(): string {
    return getGame().i18n.format(this.messageKey, { type: "WvActor" });
  }
}

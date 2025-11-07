import { getI18n } from "../../wvI18n.js";
import RuleElementMessage from "../ruleElementMessage.js";

export default class NotActorMessage extends RuleElementMessage {
  constructor() {
    super("wv.system.ruleEngine.errors.logical.wrongDocumentType", "error");
  }

  override get message(): string {
    return getI18n().format(this.messageKey, { type: "WvActor" });
  }
}

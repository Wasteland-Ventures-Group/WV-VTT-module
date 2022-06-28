import { getGame } from "../foundryHelpers.js";
import type { WvI18nKey } from "../lang.js";

/** A message in a RuleElement */
export default class RuleElementMessage {
  constructor(
    /** The message key for the textual message */
    public messageKey: WvI18nKey,

    /** The type of the message. */
    public type: MessageType = "info"
  ) {}

  /** Get the CSS class for this type of message. */
  get cssClass(): `rule-element-${MessageType}-message` {
    return `rule-element-${this.type}-message`;
  }

  /** Get the icon class for this type of message. */
  get iconClass(): string {
    return {
      error: "fa-exclamation-circle",
      info: "fa-info-circle",
      warning: "fa-exclamation-triangle"
    }[this.type];
  }

  /** Get the message of this warning. */
  get message(): string {
    return getGame().i18n.localize(this.messageKey);
  }

  /** Return whether this message is an error */
  isError(): boolean {
    return this.type === "error";
  }

  /** Return whether this message is a warning */
  isWarning(): boolean {
    return this.type === "warning";
  }
}

export type MessageType = "info" | "warning" | "error";

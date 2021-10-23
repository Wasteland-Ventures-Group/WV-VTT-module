import { getGame } from "../foundryHelpers.js";

/** A warning in a RuleElement. */
export default class RuleElementMessage {
  constructor(
    /** The message key for the actual warning */
    public messageKey: string,

    /** The type of the message. */
    public type: MessageType = "info"
  ) {}

  get cssClass(): `rule-element-${MessageType}-message` {
    return `rule-element-${this.type}-message`;
  }

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

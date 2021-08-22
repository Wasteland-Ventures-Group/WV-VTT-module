import RuleElementWarning from "../ruleElementWarning.js";

/** A warning about a wrong field type with a replacement message */
export default class WrongTypeWarning extends RuleElementWarning {
  constructor(
    /** The message key for the actual warning */
    public messageKey: string,

    /** The value the field was changed to */
    public changeValue: string | number | boolean,

    /** The message key for the change message */
    public changeMessageKey: string = "wv.ruleEngine.errors.messages.changedToDefault"
  ) {
    super(messageKey);
  }
}

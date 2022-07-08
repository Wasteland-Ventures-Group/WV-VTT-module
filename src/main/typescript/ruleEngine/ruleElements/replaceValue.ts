import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import RuleElement from "../ruleElement.js";

/** A RuleElement that replaces the value of the target data point. */
export default class ReplaceValue extends RuleElement {
  protected override validateAgainstDocument(document: WvActor | WvItem): void {
    super.validateAgainstDocument(document);
    this.checkTypeChanged(document);
  }

  protected override innerApply(document: WvActor | WvItem): void {
    this.setProperty(document, this.value);
  }
}

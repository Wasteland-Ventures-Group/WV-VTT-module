import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the target
 * data point.
 */
export default class FlatModifier extends RuleElement {
  protected override validate(): void {
    super.validate();
    this.checkValueIsOfType("number");
  }

  protected override validateAgainstDocument(document: WvActor | WvItem): void {
    super.validateAgainstDocument(document);
    this.checkTargetIsOfType(document, "number");
  }

  protected override innerApply(document: WvActor | WvItem): void {
    if (typeof this.value !== "number") return;

    this.setProperty(
      document,
      (this.getProperty(document) as number) + this.value
    );
  }
}

import type WvActor from "../../actor/wvActor.js";
import { CompositeNumber } from "../../data/common.js";
import type WvItem from "../../item/wvItem.js";
import NotCompositeNumberMessage from "../messages/notCompositeNumberMessage.js";
import RuleElement from "../ruleElement.js";

/** A RuleElement that adds a component to a CompositeNumber. */
export default class NumberComponent extends RuleElement {
  protected override validate(): void {
    super.validate();
    this.checkValueIsOfType("number");
  }

  protected override validateAgainstDocument(document: WvActor | WvItem): void {
    super.validateAgainstDocument(document);
    this.checkTargetIsCompositeNumber(document);
  }

  protected override innerApply(document: WvActor | WvItem): void {
    if (typeof this.value !== "number") return;

    this.mapProperties(document, (value) => {
      if (typeof this.value !== "number") return;

      const modNumber = CompositeNumber.from(value);
      modNumber.add({
        value: this.value,
        labelComponents: this.labelComponents
      });
      return modNumber;
    });
  }

  /**
   * Check whether the target property is a CompositeNumber or
   * CompositeNumberSource.
   *
   * If the type is incorrect, an error message is added to the RuleElement.
   * @remarks When this is called, it should already be verified that the
   *          target actually matches a property.
   */
  protected checkTargetIsCompositeNumber(document: WvActor | WvItem) {
    for (const property of this.getProperties(document)) {
      if (property instanceof CompositeNumber) continue;
      if (CompositeNumber.isSource(property)) continue;

      this.addDocumentMessage(
        document,
        new NotCompositeNumberMessage(this.target)
      );
      break;
    }
  }
}

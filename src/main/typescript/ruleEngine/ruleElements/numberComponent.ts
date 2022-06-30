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

  protected override validateAgainstDocument(
    document: StoredDocument<WvActor | WvItem>
  ): void {
    super.validateAgainstDocument(document);
    this.checkTargetIsCompositeNumber(document);
  }

  protected override innerApply(
    document: StoredDocument<WvActor | WvItem>
  ): void {
    if (typeof this.value !== "number") return;

    const modNumber = CompositeNumber.from(this.getProperty(document));
    modNumber.add({ value: this.value, labelComponents: this.labelComponents });
    this.setProperty(document, modNumber);
  }

  /**
   * Check whether the target property is a CompositeNumber or
   * CompositeNumberSource.
   *
   * If the type is incorrect, an error message is added to the RuleElement.
   * @remarks When this is called, it should already be verified that the
   *          target actually matches a property.
   */
  protected checkTargetIsCompositeNumber(
    document: StoredDocument<WvActor | WvItem>
  ) {
    const property = this.getProperty(document);

    if (property instanceof CompositeNumber) return;
    if (CompositeNumber.isSource(property)) return;

    this.addDocumentMessage(
      document,
      new NotCompositeNumberMessage(this.target)
    );
  }
}

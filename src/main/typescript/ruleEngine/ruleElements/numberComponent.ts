import { CompositeNumber } from "../../data/common.js";
import NotCompositeNumberMessage from "../messages/notCompositeNumberMessage.js";
import RuleElement from "../ruleElement.js";

export default class NumberComponent extends RuleElement {
  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkSelectedIsCompositeNumber();
  }

  protected override _onAfterSpecial(): void {
    this.apply();
  }

  protected override _onAfterSkills(): void {
    this.apply();
  }

  protected override _onAfterComputation(): void {
    this.apply();
  }

  protected checkSelectedIsCompositeNumber() {
    const property = this.property;

    if (property instanceof CompositeNumber) return;
    if (CompositeNumber.isSource(property)) return;

    this.messages.push(
      new NotCompositeNumberMessage(this.targetName, this.selector)
    );
  }

  /** Apply the rule element to the target Document. */
  protected apply(): void {
    if (typeof this.value !== "number") return;

    const modNumber = CompositeNumber.from(this.property);
    modNumber.add({ value: this.value, label: this.label });
    this.property = modNumber;
  }
}

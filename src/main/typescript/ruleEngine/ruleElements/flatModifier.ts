import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the selected
 * data point.
 */
export default class FlatModifier extends RuleElement {
  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkSelectedIsOfType("number");
    this.checkValueIsOfType("number");
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

  /** Apply the rule element to the target Document. */
  protected apply(): void {
    if (typeof this.value !== "number") return;

    this.property = (this.property as number) + this.value;
  }
}

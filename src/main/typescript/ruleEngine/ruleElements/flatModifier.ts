import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the target
 * data point.
 */
export default class FlatModifier extends RuleElement {
  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkTargetIsOfType("number");
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

  protected apply(): void {
    if (typeof this.value !== "number") return;

    this.property = (this.property as number) + this.value;
  }
}

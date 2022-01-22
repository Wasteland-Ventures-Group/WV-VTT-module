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

  /** Apply the rule element to the target Document. */
  protected apply(): void {
    if (typeof this.value !== "number") return;

    const oldValue: number = foundry.utils.getProperty(
      this.targetDoc.data.data,
      this.selector
    );

    const newValue = oldValue + this.value;
    foundry.utils.setProperty(
      this.targetDoc.data.data,
      this.selector,
      newValue
    );
  }
}

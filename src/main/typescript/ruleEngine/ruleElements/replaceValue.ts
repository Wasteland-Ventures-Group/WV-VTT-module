import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that replaces the value of the selected data point.
 */
export default class ReplaceValue extends RuleElement {
  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkTypeChanged();
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
    foundry.utils.setProperty(
      this.targetDoc.data.data,
      this.selector,
      this.value
    );
  }
}

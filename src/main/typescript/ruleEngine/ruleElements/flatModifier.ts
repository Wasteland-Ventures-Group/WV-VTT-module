import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the selected
 * data point.
 */
export default class FlatModifier extends RuleElement {
  /**
   * The expected primitive type of the selected property for this RuleElement
   */
  static readonly EXPECTED_TYPE = "number";

  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkSelectedIsOfType(FlatModifier.EXPECTED_TYPE);
  }

  protected override _onPrepareEmbeddedDocuments(): void {
    const oldValue = foundry.utils.getProperty(
      this.targetDoc.data.data,
      this.selector
    );

    if (typeof oldValue !== FlatModifier.EXPECTED_TYPE) {
      throw new Error("The selected property was not a number!");
    }

    const newValue = oldValue + this.value;
    foundry.utils.setProperty(
      this.targetDoc.data.data,
      this.selector,
      newValue
    );
  }
}

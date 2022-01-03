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

  protected override _onPrepareEmbeddedDocuments(): void {
    foundry.utils.setProperty(
      this.targetDoc.data.data,
      this.selector,
      this.value
    );
  }
}

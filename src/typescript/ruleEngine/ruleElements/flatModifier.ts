import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the selected
 * data point.
 */
export default class FlatModifier extends RuleElement {
  override _onPrepareEmbeddedEntities(doc: Actor | Item): void {
    const oldValue = foundry.utils.getProperty(doc.data.data, this.selector);
    if (typeof oldValue === "number") {
      const newValue = oldValue + this.value;
      doc.data.update({ [this.selector]: newValue });
    }
  }
}

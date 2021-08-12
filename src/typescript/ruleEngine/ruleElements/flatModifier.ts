import RuleElement from "../ruleElement.js";

/**
 * A RuleElement that applies a flat positive or negative value to the selected
 * data point.
 */
export default class FlatModifier implements RuleElement {
  /** The type identifier for this RuleElement. */
  static readonly TYPE = "WV.RuleElement.FlatModifier";

  /**
   * Create a new FlatModifier from an unknown JSON object.
   * @param json - the unknow, serialized JSON object
   * @returns a FlatModifier if the needed properties existed, null otherwise
   */
  static fromJson(json: unknown): FlatModifier | null {
    if (typeof json !== "object" || !json) return null;

    const rule: Partial<RuleElement> = json;
    if (!rule.selector || !rule.value) return null;

    return new FlatModifier(rule.selector, rule.value, rule.label);
  }

  /**
   * Create a new FlatModifier.
   * @param selector - the selector to use
   * @param value - the modification value
   * @param label - an descriptive label
   */
  constructor(selector: string, value: number, label?: string) {
    this.label = label || "";
    this.selector = selector;
    this.value = value;
  }

  readonly label: string;

  readonly selector: string;

  readonly value: number;

  get type(): string {
    return FlatModifier.TYPE;
  }

  modify(doc: Actor | Item): void {
    const oldValue = foundry.utils.getProperty(doc.data.data, this.selector);
    if (typeof oldValue === "number") {
      const newValue = oldValue + this.value;
      doc.data.update({ [this.selector]: newValue });
    }
  }
}

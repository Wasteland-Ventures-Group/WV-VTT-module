import type { RuleElementSource } from "../ruleEngine/ruleElement.js";
import { TYPES } from "../constants.js";
import RuleElements from "../ruleEngine/ruleElements.js";
import WvItem from "./wvItem.js";

/** An Item that can represent an arbitrary effect, using RuleElements. */
export default class Effect extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.EFFECT)
      throw `The passed data's type is not ${TYPES.ITEM.EFFECT}.`;

    super(data, context);
  }

  override prepareBaseData(): void {
    if (this.data.type !== TYPES.ITEM.EFFECT)
      throw `This Item data's type is not ${TYPES.ITEM.EFFECT}.`;

    this.data.data.rules.elements = this.data.data.rules.sources.map((rule) =>
      RuleElements.fromOwningItem(rule, this)
    );
  }

  /**
   * Update the RuleElement sources of this Effect.
   * @param sources - the new RuleElements
   */
  updateRuleSources(sources: RuleElementSource[]): void {
    this.update({
      _id: this.id,
      data: { rules: { sources: sources } }
    });
  }
}

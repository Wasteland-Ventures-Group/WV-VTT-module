import { TYPES } from "../constants.js";
import { present } from "../helpers.js";
import RuleElement from "../ruleEngine/ruleElement.js";
import WvItem from "./wvItem.js";

/**
 * An Item that can represent an arbitrary effect, using RuleElements.
 */
export default class Effect extends WvItem {
  override prepareBaseData(): void {
    if (this.data.type !== TYPES.ITEM.EFFECT) return;

    this.data.data.rules = this.data.data.rules
      .map((rule) => {
        if (!(rule instanceof RuleElement)) {
          return RuleElement.fromJson(rule);
        } else {
          return rule;
        }
      })
      .filter(present);
  }
}

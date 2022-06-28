import type Effect from "../../item/effect.js";
import { TYPES } from "../../constants.js";
import { isOfItemType } from "../../item/wvItem.js";
import WvItemSheet from "./wvItemSheet.js";
import type RuleElementSource from "../../ruleEngine/ruleElementSource.js";

/** An Item Sheet for Effect items. */
export default class EffectSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("effect-sheet");
    defaultOptions.height = 500;
    defaultOptions.width = 670;
    defaultOptions.tabs = [];
    return defaultOptions;
  }

  override get item(): Effect {
    if (!isOfItemType(super.item, TYPES.ITEM.EFFECT))
      throw new Error("The used Item is not an Effect.");

    return super.item;
  }

  protected override getDefaultRuleElementSource(): RuleElementSource {
    const source = super.getDefaultRuleElementSource();
    source.selector = "actor";
    return source;
  }
}

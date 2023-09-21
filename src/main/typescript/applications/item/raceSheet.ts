import { TYPES } from "../../constants.js";
import type Race from "../../item/race.js";
import { isOfItemType } from "../../item/wvItem.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElementSource.js";
import WvItemSheet from "./wvItemSheet.js";

/** An Item Sheet for Race items. */
export default class RaceSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("race-sheet");
    defaultOptions.height = 500;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Race {
    if (!isOfItemType(super.item, TYPES.ITEM.RACE))
      throw new Error("The used Item is not a Race.");

    return super.item;
  }

  protected override getDefaultRuleElementSource(): RuleElementSource {
    const source = super.getDefaultRuleElementSource();
    source.selectors = ["actor", "parent"];
    return source;
  }
}

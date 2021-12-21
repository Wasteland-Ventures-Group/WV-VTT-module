import type Effect from "../../item/effect.js";
import { TYPES } from "../../constants.js";
import { isOfItemType } from "../../helpers.js";
import WvItemSheet from "./wvItemSheet.js";

/** An Item Sheet for Effect items. */
export default class EffectSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("effect-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      height: 500,
      width: 670
    } as typeof ItemSheet["defaultOptions"]);
  }

  override get item(): Effect {
    if (!isOfItemType(super.item, TYPES.ITEM.EFFECT))
      throw new Error("The used Item is not an Effect!");

    return super.item;
  }
}

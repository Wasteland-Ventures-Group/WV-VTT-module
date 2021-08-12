import WvItemSheet from "./wvItemSheet.js";

/** An Item Sheet for Effect items. */
export default class EffectSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("effect-sheet");
    return defaultOptions;
  }
}

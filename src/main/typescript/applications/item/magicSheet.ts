import WvItemSheet, { SheetData } from "./wvItemSheet";
import type Magic from "../../item/magic";

export default class MagicSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("magic-sheet");
    defaultOptions.height = 260;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Magic {
    return super.item;
  }
}

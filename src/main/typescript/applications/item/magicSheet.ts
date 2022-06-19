import { TYPES } from "../../constants";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet";
import { isOfItemType } from "../../item/wvItem.js";
import type Magic from "../../item/magic";
import WvI18n, { I18nSchools } from "../../wvI18n";

export default class MagicSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("magic-sheet");
    defaultOptions.height = 260;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Magic {
    if (!isOfItemType(super.item, TYPES.ITEM.MAGIC)) {
      throw new Error("The used Item is not a Magic.");
    }
    return super.item;
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    const schoolsI18n = WvI18n.schools;

    return {
      ...data,
      sheet: {
        ...data.sheet,
        schools: schoolsI18n,
        school: schoolsI18n[this.item.systemData.school]
      }
    };
  }
}

export interface SheetMagic {
  school: string;
  schools: I18nSchools;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetMagic;
}

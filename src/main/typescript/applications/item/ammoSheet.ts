import { TYPES } from "../../constants.js";
import type Ammo from "../../item/ammo.js";
import { isOfItemType } from "../../item/wvItem.js";
import type { I18nCalibers } from "../../wvI18n.js";
import WvI18n from "../../wvI18n.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";

/** An Item sheet for Ammo items. */
export default class AmmoSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("ammo-sheet");
    defaultOptions.height = 260;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Ammo {
    if (!isOfItemType(super.item, TYPES.ITEM.AMMO))
      throw new Error("The used Item is not an Apparel.");

    return super.item;
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();

    const calibersI18n = WvI18n.calibers;

    return {
      ...data,
      sheet: {
        ...data.sheet,
        caliber: calibersI18n[this.item.data.data.caliber],
        calibers: calibersI18n
      }
    };
  }
}

export interface SheetAmmo {
  caliber: string;
  calibers: I18nCalibers;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetAmmo;
}

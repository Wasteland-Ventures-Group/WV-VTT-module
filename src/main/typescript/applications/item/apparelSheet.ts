import { TYPES } from "../../constants.js";
import type Apparel from "../../item/apparel.js";
import { isOfItemType } from "../../item/wvItem.js";
import type { I18nApparelSlots, I18nApparelTypes } from "../../wvI18n.js";
import WvI18n from "../../wvI18n.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";

/** An Item sheet for Apparel items. */
export default class ApparelSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("apparel-sheet");
    return defaultOptions;
  }

  /** Get the apparel sheet data for an Apparel. */
  static getApparelSheetData(apparel: Apparel): SheetApparel {
    const slotsI18ns = WvI18n.apparelSlots;
    const typesI18ns = WvI18n.apparelTypes;

    return {
      slot: slotsI18ns[apparel.systemData.slot],
      slots: slotsI18ns,
      type: typesI18ns[apparel.systemData.type],
      types: typesI18ns
    };
  }

  override get item(): Apparel {
    if (!isOfItemType(super.item, TYPES.ITEM.APPAREL))
      throw new Error("The used Item is not an Apparel.");

    return super.item;
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();

    return {
      ...data,
      sheet: {
        ...data.sheet,
        ...ApparelSheet.getApparelSheetData(this.item)
      }
    };
  }
}

export interface SheetApparel {
  slot: string;
  slots: I18nApparelSlots;
  type: string;
  types: I18nApparelTypes;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetApparel;
}

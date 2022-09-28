import { type ApparelSlot, isApparelSlot, TYPES } from "../../constants.js";
import type Apparel from "../../item/apparel.js";
import { isOfItemType } from "../../item/wvItem.js";
import WvI18n, {
  type I18nApparelSlots,
  type I18nApparelTypes
} from "../../wvI18n.js";
import WvItemSheet, { type SheetData as ItemSheetData } from "./wvItemSheet.js";

/** An Item sheet for Apparel items. */
export default class ApparelSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("apparel-sheet");
    defaultOptions.height = 300;
    defaultOptions.width = 500;
    return defaultOptions;
  }

  /** Get the apparel sheet data for an Apparel. */
  static getApparelSheetData(apparel: Apparel): SheetApparel {
    const slotsI18ns = WvI18n.apparelSlots;
    const typesI18ns = WvI18n.apparelTypes;

    return {
      blockedSlots: apparel.blockedApparelSlots.map((slot) => slotsI18ns[slot]),
      slot: slotsI18ns[apparel.data.data.slot],
      slots: slotsI18ns,
      type: typesI18ns[apparel.data.data.type],
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

  protected override _updateObject(
    event: Event,
    formData: Record<string, unknown>
  ): Promise<unknown> {
    this.patchBlockedApparelSlots(formData);
    return super._updateObject(event, formData);
  }

  /** Patch the form data to set the self-occupied slot to not blocked. */
  protected patchBlockedApparelSlots(formData: Record<string, unknown>) {
    const ownSlot = this.getOwnSlot(formData);
    formData[`data.blockedSlots.${ownSlot}`] = false;
  }

  protected getOwnSlot(formData: Record<string, unknown>): ApparelSlot {
    const slot = formData["data.slot"];
    if (typeof slot === "string" && isApparelSlot(slot)) return slot;
    return this.item.data.data.slot;
  }
}

export interface SheetApparel {
  blockedSlots: string[];
  slot: string;
  slots: I18nApparelSlots;
  type: string;
  types: I18nApparelTypes;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetApparel;
}

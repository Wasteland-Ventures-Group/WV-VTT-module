import { ApparelSlots, isApparelSlot, TYPES } from "../../constants.js";
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
      blockedSlots: apparel.blockedApparelSlots.map((slot) => slotsI18ns[slot]),
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

  protected override _updateObject(
    event: Event,
    formData: Record<string, unknown>
  ): Promise<unknown> {
    this.patchBlockedApparelSlots(formData);
    return super._updateObject(event, formData);
  }

  /** Patch the form data to set disabled blocked slots to false. */
  protected patchBlockedApparelSlots(formData: Record<string, unknown>) {
    const slot = formData["data.slot"];
    if (typeof slot === "string" && isApparelSlot(slot))
      formData[`data.blockedSlots.${slot}`] = false;
    else
      for (const slotName of ApparelSlots)
        if (!(typeof formData[`data.blockedSlots.${slotName}`] === "boolean"))
          formData[`data.blockedSlots.${slotName}`] = false;
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

import type { DeepPartial } from "fvtt-types/utils";
import { type ApparelSlot, isApparelSlot, TYPES } from "../../constants.js";
import type Apparel from "../../item/apparel.js";
import { isOfItemType } from "../../item/wvItem.js";
import WvI18n, {
  type I18nApparelSlots,
  type I18nApparelTypes
} from "../../wvI18n.js";
import WvItemSheet, { type SheetContext as ItemSheetContext } from "./wvItemSheet.js";
import ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

/** An Item sheet for Apparel items. */
export default class ApparelSheet extends WvItemSheet {
  static override DEFAULT_OPTIONS = {
    ...WvItemSheet.DEFAULT_OPTIONS,
    classes: ["apparel-sheet"],
    position: { height: 300, width: 500 },
  }

  /** Get the apparel sheet data for an Apparel. */
  static getApparelSheetData(apparel: Apparel): SheetApparel {
    const slotsI18ns = WvI18n.apparelSlots;
    const typesI18ns = WvI18n.apparelTypes;

    return {
      blockedSlots: apparel.blockedApparelSlots.map((slot) => slotsI18ns[slot]),
      slot: slotsI18ns[apparel.system.slot],
      slots: slotsI18ns,
      type: typesI18ns[apparel.system.type],
      types: typesI18ns
    };
  }

  override get item(): Apparel {
    if (!isOfItemType(super.item, TYPES.ITEM.APPAREL))
      throw new Error("The used Item is not an Apparel.");

    return super.item;
  }

  override async _prepareContext(options: DeepPartial<ItemSheetV2.RenderOptions> & { isFirstRender: boolean }): Promise<SheetContext> {
    const sup = await super._prepareContext(options);
    return {
      ...sup,
      system: {
        ...sup.system,
        ...ApparelSheet.getApparelSheetData(this.item),
      }
    }
  }
  override _prepareSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended, updateData?: object): object {
    this.patchBlockedApparelSlots(formData);
    return super._prepareSubmitData(event, form, formData, updateData);
  }

  /** Patch the form data to set the self-occupied slot to not blocked. */
  protected patchBlockedApparelSlots(formData: FormDataExtended) {
    const ownSlot = this.getOwnSlot(formData);
    formData.object[`data.blockedSlots.${ownSlot}`] = false;
  }

  protected getOwnSlot(formData: FormDataExtended): ApparelSlot {
    const slot = formData.object["data.slot"];
    if (typeof slot === "string" && isApparelSlot(slot)) return slot;
    return this.item.system.slot;
  }
}

export interface SheetApparel {
  blockedSlots: string[];
  slot: string;
  slots: I18nApparelSlots;
  type: string;
  types: I18nApparelTypes;
}

export interface SheetContext extends ItemSheetContext {
  system: ItemSheetContext["system"] & SheetApparel;
}

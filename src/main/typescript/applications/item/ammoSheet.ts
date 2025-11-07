import { TYPES } from "../../constants.js";
import type Ammo from "../../item/ammo.js";
import { isOfItemType } from "../../item/wvItem.js";
import type { I18nCalibers } from "../../wvI18n.js";
import WvItemSheet, { type SheetContext as ItemSheetContext } from "./wvItemSheet.js";
import ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;
import type { DeepPartial } from "fvtt-types/utils";
import WvI18n from "../../wvI18n.js";

/** An Item sheet for Ammo items. */
export default class AmmoSheet extends WvItemSheet {
  static override DEFAULT_OPTIONS = {
    classes: ["ammo-sheet"],
    position: { height: 260, width: 670 },
  }

  override async _prepareContext(options: DeepPartial<ItemSheetV2.RenderOptions> & { isFirstRender: boolean }): Promise<SheetContext> {
    const calibersI18n = WvI18n.calibers;
    const sup = await super._prepareContext(options);
    return {
      ...sup,
      system: {
        ...sup.system,
        caliber: calibersI18n[this.item.system.caliber],
        calibers: calibersI18n
      }
    }
  }

  override get item(): Ammo {
    if (!isOfItemType(super.item, TYPES.ITEM.AMMO))
      throw new Error("The used Item is not an Ammo.");

    return super.item;
  }
}

export interface SheetAmmo {
  caliber: string;
  calibers: I18nCalibers;
}

export interface SheetContext extends ItemSheetContext {
  system: ItemSheetContext["system"] & SheetAmmo;
}

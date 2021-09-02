import { TYPES } from "../../constants.js";
import { isOfItemType } from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";

export default class WeaponSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("weapon-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      height: 500,
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      width: 670
    } as typeof ItemSheet["defaultOptions"]);
  }

  override get item(): Weapon {
    if (!isOfItemType(super.item, TYPES.ITEM.WEAPON))
      throw "The used Item is not a Weapon!";

    return super.item;
  }

  override async getData(): Promise<SheetData> {
    if (this.item.data.type !== "weapon")
      throw "The Weapon data is of the wrong type!";

    const data: SheetData = await super.getData();
    if (!data.sheet) data.sheet = {};

    data.sheet.usesAmmo = this.item.data.data.reload !== "self";
    return data;
  }
}

export interface SheetData extends ItemSheetData {
  sheet?: ItemSheetData["sheet"] & {
    usesAmmo?: boolean;
  };
}

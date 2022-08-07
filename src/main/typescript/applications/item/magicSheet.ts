import { isMagicType, SchoolByMagicType, TYPES } from "../../constants";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet";
import { isOfItemType } from "../../item/wvItem.js";
import type Magic from "../../item/magic";
import WvI18n, { I18nMagicSchools, I18nMagicTypes } from "../../wvI18n";

export default class MagicSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("magic-sheet");
    defaultOptions.height = 480;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Magic {
    if (!isOfItemType(super.item, TYPES.ITEM.MAGIC)) {
      throw new Error("The used Item is not a Magic.");
    }
    return super.item;
  }

  static getMagicSheetData(magic: Magic) {
    const typesI18n = WvI18n.magicTypes;
    const type = magic.data.data.type;
    const typeI18n = typesI18n[type];
    const schoolsI18n = WvI18n.getMagicSchools(type);
    const school = magic.data.data.school;
    const schoolI18n = schoolsI18n[school];
    if (!schoolI18n) {
      throw new Error(`Invalid value of school (${school}) for type ${type}`);
    }

    return {
      school: schoolI18n,
      schools: schoolsI18n,
      type: typeI18n,
      types: typesI18n
    };
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();

    return {
      ...data,
      sheet: {
        ...data.sheet,
        ...MagicSheet.getMagicSheetData(this.item)
      }
    };
  }

  onTypeChange(event: Event) {
    if (!(event.target instanceof HTMLSelectElement))
      throw new Error("The target was not an HTMLSelectElement.");

    const selectedTypes = event.target.selectedOptions;
    const selectedType = selectedTypes[0]?.value;
    const itemData = this.item.data.data;
    if (!isMagicType(selectedType)) {
      throw new Error("The selected type is not a valid MagicType.");
    }

    // No change
    if (itemData.type == selectedType) {
      return;
    }

    // Change of type, reset to the first appropriate school
    this.item.update({
      data: { school: SchoolByMagicType[selectedType][0] }
    });
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);
    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element.");

    sheetForm
      .querySelector("select.type")
      ?.addEventListener("change", (event) => this.onTypeChange(event));
  }
}

export interface SheetMagic {
  school: string;
  schools: Partial<I18nMagicSchools>;
  type: string;
  types: I18nMagicTypes;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetMagic;
}

import { MagicType, MagicTypes, TYPES } from "../../constants";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet";
import { isOfItemType } from "../../item/wvItem.js";
import type Magic from "../../item/magic";
import WvI18n, { I18nMagicSchools } from "../../wvI18n";

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
    const schoolsI18n = WvI18n.magicSchools;
    const school = magic.data.data.school;
    const schoolI18n = schoolsI18n[school];
    if (!schoolI18n) {
      throw new Error(`Invalid value of school (${school}) for type ${type}`);
    }

    const schools = MagicTypes.reduce((acc, type) => {
      const typeI18n = typesI18n[type];
      acc[type] = { label: typeI18n, options: WvI18n.getMagicSchools(type) };
      return acc;
    }, {} as SheetMagicSchools);

    return {
      school: schoolI18n,
      schools
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
}

type SheetMagicSchools = Record<
  MagicType,
  { label: string; options: Partial<I18nMagicSchools> }
>;

export interface SheetMagic {
  school: string;
  schools: SheetMagicSchools;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetMagic;
}

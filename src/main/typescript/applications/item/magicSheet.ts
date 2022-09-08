import { MagicType, MagicTypes, TYPES } from "../../constants";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet";
import { isOfItemType } from "../../item/wvItem.js";
import type Magic from "../../item/magic";
import WvI18n, { I18nMagicSchools } from "../../wvI18n";

/** An Item Sheet for Magic items. */
export default class MagicSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("magic-sheet");
    defaultOptions.height = 700;
    defaultOptions.width = 670;
    return defaultOptions;
  }

  override get item(): Magic {
    if (!isOfItemType(super.item, TYPES.ITEM.MAGIC))
      throw new Error("The used Item is not a Magic.");

    return super.item;
  }

  static getMagicSheetData(magic: Magic) {
    const typesI18n = WvI18n.magicTypes;
    const type = magic.data.data.type;
    const school = magic.data.data.school;
    const schoolI18n = WvI18n.magicSchools[school];
    if (!schoolI18n)
      throw new Error(`Invalid value of school (${school}) for type ${type}`);

    return {
      school: schoolI18n,
      schools: MagicTypes.reduce((acc, type) => {
        acc[type] = {
          label: typesI18n[type],
          options: WvI18n.getMagicSchools(type)
        };
        return acc;
      }, {} as SheetMagicSchools),
      type: typesI18n[type]
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
  type: string;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetMagic;
}

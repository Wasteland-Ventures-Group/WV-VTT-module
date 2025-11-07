import { type MagicType, MagicTypes, TYPES } from "../../constants";
import WvItemSheet, { type SheetContext as ItemSheetContext } from "./wvItemSheet";
import { isOfItemType } from "../../item/wvItem.js";
import type Magic from "../../item/magic";
import WvI18n, { type I18nMagicSchools } from "../../wvI18n";
import type { DeepPartial } from "fvtt-types/utils";
import ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

/** An Item Sheet for Magic items. */
export default class MagicSheet extends WvItemSheet {
  static override DEFAULT_OPTIONS = {
    ...WvItemSheet.DEFAULT_OPTIONS,
    classes: ["magic-sheet"],
    position: { height: 700, width: 670 },
  }
  override get item(): Magic {
    if (!isOfItemType(super.item, TYPES.ITEM.MAGIC))
      throw new Error("The used Item is not a Magic.");

    return super.item;
  }

  static getMagicSheetData(magic: Magic) {
    const typesI18n = WvI18n.magicTypes;
    const type = magic.system.type;
    const school = magic.system.school;
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

  override async _prepareContext(options: DeepPartial<ItemSheetV2.RenderOptions> & { isFirstRender: boolean }): Promise<SheetContext> {
    const data = await super._prepareContext(options);

    return {
      ...data,
      system: {
        ...data.system,
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

export interface SheetContext extends ItemSheetContext {
  system: ItemSheetContext["system"] & SheetMagic;
}

import { TYPES } from "../../constants.js";
import { isOfItemType } from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import WvI18n from "../../wvI18n.js";
import RollModifierDialog from "../rollModifierDialog.js";
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

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html
      .find("button[data-attack]")
      .on("click", this.onClickAttackExecute.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data: SheetData = await super.getData();
    if (!data.sheet) data.sheet = {};

    data.sheet.skill = WvI18n.skills[this.item.systemData.skill];
    data.sheet.usesAmmo = this.item.systemData.reload !== "self";
    return data;
  }

  /**
   * Handle a click event on an Attack execute button.
   */
  protected onClickAttackExecute(event: ClickEvent): void {
    const attackKey = event.target.dataset.attack;
    if (!attackKey) return;

    const attack = this.item.systemData.attacks.attacks[attackKey];
    if (!attack) return;

    if (event.shiftKey) {
      new RollModifierDialog(
        (modifier) => {
          attack.execute({ modifier: modifier, whisperToGms: event.ctrlKey });
        },
        {
          min: -100,
          max: 100
        }
      ).render(true);
    } else {
      attack.execute({ whisperToGms: event.ctrlKey });
    }
  }
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

export interface SheetData extends ItemSheetData {
  sheet?: ItemSheetData["sheet"] & {
    skill?: string;
    usesAmmo?: boolean;
  };
}

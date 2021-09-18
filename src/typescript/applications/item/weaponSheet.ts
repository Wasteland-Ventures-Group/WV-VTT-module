import { TYPES } from "../../constants.js";
import { isOfItemType } from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import type { WeaponAttackDragData } from "../../item/weapon/attack.js";
import WvI18n from "../../wvI18n.js";
import RollModifierDialog from "../rollModifierDialog.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";

export default class WeaponSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("weapon-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      height: 500,
      dragDrop: [{ dragSelector: ".weapon-attack > button[data-attack]" }],
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
      .find(".weapon-attack > button[data-attack]")
      .on("click", this.onClickAttackExecute.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data: SheetData = await super.getData();
    if (!data.sheet) data.sheet = {};

    data.sheet.skill = WvI18n.skills[this.item.systemData.skill];
    data.sheet.usesAmmo = this.item.systemData.reload !== "self";
    return data;
  }

  override _onDragStart(event: DragEvent): void {
    if (!this.item.actor?.id || !this.item.id) return super._onDragStart(event);

    const target = event.target;
    if (!(target instanceof HTMLElement)) return super._onDragStart(event);

    const attackKey = target.dataset.attack;
    if (!attackKey) return super._onDragStart(event);

    const dragData: WeaponAttackDragData = {
      actorId: this.item.actor.id,
      attackName: attackKey,
      type: "weaponAttack",
      weaponId: this.item.id
    };

    event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));

    if (this.item.img) {
      const image = new Image();
      image.src = this.item.img;
      const height = 50;
      const width = 50;
      event.dataTransfer?.setDragImage(
        DragDrop.createDragImage(image, width, height),
        width / 2,
        height / 2
      );
    }
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

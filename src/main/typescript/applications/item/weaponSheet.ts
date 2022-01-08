import { CONSTANTS, TYPES } from "../../constants.js";
import type { Range } from "../../data/item/weapon/ranges/source.js";
import { isOfItemType } from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import type { WeaponAttackDragData } from "../../item/weapon/attack.js";
import * as ranges from "../../item/weapon/ranges.js";
import WvI18n from "../../wvI18n.js";
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
      throw new Error("The used Item is not a Weapon!");

    return super.item;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html
      .find(".weapon-attack > button[data-attack]")
      .on("click", this.onClickAttackExecute.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    return {
      ...data,
      sheet: {
        ...data.sheet,
        attacks: Object.entries(this.item.systemData.attacks.attacks).reduce<
          Record<string, SheetAttack>
        >((obj, [name, attack]) => {
          obj[name] = {
            ap: attack.data.ap,
            damage: attack.damageFormula,
            dtReduction: attack.data.dtReduction,
            rounds: attack.data.rounds
          };
          return obj;
        }, {}),
        ranges: {
          short: this.mapToSheetRange(this.item.systemData.ranges.short),
          medium: this.mapToSheetRange(this.item.systemData.ranges.medium),
          long: this.mapToSheetRange(this.item.systemData.ranges.long)
        },
        skill: WvI18n.skills[this.item.systemData.skill],
        usesAmmo: this.item.systemData.reload !== undefined
      }
    };
  }

  override _canDragStart(): boolean {
    return this.isEditable;
  }

  override _onDragStart(event: DragEvent): void {
    if (!this.item.id) return super._onDragStart(event);

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return super._onDragStart(event);

    const attackKey = target.dataset.attack;
    if (!attackKey) return super._onDragStart(event);

    const dragData: WeaponAttackDragData = {
      actorId: this.item.actor?.id,
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
  protected async onClickAttackExecute(event: ClickEvent): Promise<void> {
    const attackKey = event.target.dataset.attack;
    if (!attackKey) return;

    const attack = this.item.systemData.attacks.attacks[attackKey];
    if (!attack) return;

    attack.execute({ whisperToGms: event.ctrlKey });
  }

  /**
   * Map a Range to a sheet displayable Range
   * @param range - the Range to map
   * @returns a sheet displayable Range
   */
  protected mapToSheetRange(range: Range): SheetRange;
  protected mapToSheetRange(range: undefined): undefined;
  protected mapToSheetRange(range: Range | undefined): SheetRange | undefined;
  protected mapToSheetRange(range: Range | undefined): SheetRange | undefined {
    if (!range) return;

    return {
      distance: ranges.getDisplayRangeDistance(
        range.distance,
        this.actor?.data.data.specials
      ),
      modifier: range.modifier
    };
  }
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

interface SheetAttack {
  ap: number;
  damage: string;
  dtReduction: number | undefined;
  rounds: number | undefined;
}

interface SheetRange {
  distance: string;
  modifier: number;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & {
    attacks: Record<string, SheetAttack>;
    ranges: {
      short: SheetRange;
      medium: SheetRange | undefined;
      long: SheetRange | undefined;
    };
    skill: string;
    usesAmmo: boolean;
  };
}

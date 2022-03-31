import { TYPES } from "../../constants.js";
import type { RangeSource } from "../../data/item/weapon/ranges/source.js";
import { isOfItemType } from "../../item/wvItem.js";
import type Weapon from "../../item/weapon.js";
import type { WeaponAttackDragData } from "../../item/weapon/attack.js";
import * as ranges from "../../item/weapon/ranges.js";
import WvI18n from "../../wvI18n.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";
import { getGame } from "../../foundryHelpers.js";
import type WvActor from "../../actor/wvActor.js";

export default class WeaponSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("weapon-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      dragDrop: [{ dragSelector: ".weapon-attack > button[data-attack]" }]
    } as typeof ItemSheet["defaultOptions"]);
  }

  /** Get the weapon sheet data for a weapon. */
  static getWeaponSheetData(weapon: Weapon): SheetWeapon {
    return {
      attacks: Object.entries(weapon.systemData.attacks.attacks).reduce<
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
        short: this.mapToSheetRange(
          weapon.systemData.ranges.short,
          weapon.actor
        ),
        medium: this.mapToSheetRange(
          weapon.systemData.ranges.medium,
          weapon.actor
        ),
        long: this.mapToSheetRange(weapon.systemData.ranges.long, weapon.actor)
      },
      reload: {
        caliber: weapon.systemData.reload
          ? WvI18n.calibers[weapon.systemData.reload.caliber]
          : undefined,
        containerType: weapon.systemData.reload
          ? getGame().i18n.localize(
              `wv.rules.equipment.weapon.reload.containerTypes.` +
                weapon.systemData.reload.containerType
            )
          : undefined
      },
      skill: WvI18n.skills[weapon.systemData.skill],
      usesAmmo: weapon.systemData.reload !== undefined
    };
  }

  /**
   * Map a Range to a sheet displayable Range
   * @param range - the Range to map
   * @returns a sheet displayable Range
   */
  protected static mapToSheetRange(
    range: RangeSource,
    actor: WvActor | null
  ): SheetRange;
  protected static mapToSheetRange(
    range: undefined,
    actor: WvActor | null
  ): undefined;
  protected static mapToSheetRange(
    range: RangeSource | undefined,
    actor: WvActor | null
  ): SheetRange | undefined;
  protected static mapToSheetRange(
    range: RangeSource | undefined,
    actor: WvActor | null
  ): SheetRange | undefined {
    if (!range) return;

    return {
      distance: ranges.getDisplayRangeDistance(
        range.distance,
        actor?.data.data.specials
      ),
      modifier: range.modifier
    };
  }

  override get item(): Weapon {
    if (!isOfItemType(super.item, TYPES.ITEM.WEAPON))
      throw new Error("The used Item is not a Weapon!");

    return super.item;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element!");

    sheetForm
      .querySelectorAll(".weapon-attack > button[data-attack]")
      .forEach((element) =>
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen!");
          this.onClickAttackExecute(event);
        })
      );
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();

    return {
      ...data,
      sheet: {
        ...data.sheet,
        ...WeaponSheet.getWeaponSheetData(this.item)
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

  /** Handle a click event on an Attack execute button. */
  protected async onClickAttackExecute(event: MouseEvent): Promise<void> {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const attackKey = event.target.dataset.attack;
    if (!attackKey) return;

    const attack = this.item.systemData.attacks.attacks[attackKey];
    if (!attack) return;

    attack.execute({ whisperToGms: event.ctrlKey });
  }
}

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

export interface SheetWeapon {
  attacks: Record<string, SheetAttack>;
  ranges: {
    short: SheetRange;
    medium: SheetRange | undefined;
    long: SheetRange | undefined;
  };
  reload: {
    caliber: string | undefined;
    containerType: string | undefined;
  };
  skill: string;
  usesAmmo: boolean;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetWeapon;
}

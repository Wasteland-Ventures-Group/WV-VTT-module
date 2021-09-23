import { TYPES } from "../../constants.js";
import type { Range } from "../../data/item/weapon/ranges.js";
import { getGame } from "../../foundryHelpers.js";
import { isOfItemType } from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import type { WeaponAttackDragData } from "../../item/weapon/attack.js";
import WvI18n from "../../wvI18n.js";
import Prompt from "../prompt.js";
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

    data.sheet.attacks = Object.entries(
      this.item.systemData.attacks.attacks
    ).reduce<Record<string, SheetAttack>>((obj, [name, attack]) => {
      obj[name] = {
        ap: attack.data.ap,
        damage: attack.damageFormula,
        dtReduction: attack.data.dtReduction,
        rounds: attack.data.rounds
      };
      return obj;
    }, {});

    data.sheet.ranges = {};
    data.sheet.ranges.short = this.mapToSheetRange(
      this.item.systemData.ranges.short
    );
    data.sheet.ranges.medium = this.mapToSheetRange(
      this.item.systemData.ranges.medium
    );
    data.sheet.ranges.long = this.mapToSheetRange(
      this.item.systemData.ranges.long
    );

    data.sheet.skill = WvI18n.skills[this.item.systemData.skill];

    data.sheet.usesAmmo = this.item.systemData.reload !== "self";

    return data;
  }

  override _canDragStart(): boolean {
    return this.isEditable;
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
  protected async onClickAttackExecute(event: ClickEvent): Promise<void> {
    const attackKey = event.target.dataset.attack;
    if (!attackKey) return;

    const attack = this.item.systemData.attacks.attacks[attackKey];
    if (!attack) return;

    if (event.shiftKey) {
      const modifier = await Prompt.getNumber({
        description: getGame().i18n.localize(
          "wv.prompt.descriptions.genericModifier"
        ),
        min: -100,
        max: 100
      });
      attack.execute({ modifier: modifier, whisperToGms: event.ctrlKey });
    } else {
      attack.execute({ whisperToGms: event.ctrlKey });
    }
  }

  /**
   * Map a Range to a sheet displayable Range
   * @param range - the Range to map
   * @returns a sheet displayable Range
   */
  protected mapToSheetRange(range: Range | "unused"): Range | undefined {
    if (range === "unused") return;

    return {
      distance: this.item.getEffectiveRangeDistance(range.distance),
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
  dtReduction: number;
  rounds: number;
}

export interface SheetData extends ItemSheetData {
  sheet?: ItemSheetData["sheet"] & {
    attacks?: Record<string, SheetAttack>;
    ranges?: {
      short?: Range;
      medium?: Range;
      long?: Range;
    };
    skill?: string;
    usesAmmo?: boolean;
  };
}

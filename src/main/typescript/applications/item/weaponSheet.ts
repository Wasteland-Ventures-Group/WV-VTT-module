import { SpecialName, TYPES } from "../../constants.js";
import {
  AttackSource,
  ATTACK_JSON_SCHEMA
} from "../../data/item/weapon/attack/source.js";
import { getGame } from "../../foundryHelpers.js";
import type Weapon from "../../item/weapon.js";
import type { WeaponAttackDragData } from "../../item/weapon/attack.js";
import * as ranges from "../../item/weapon/ranges.js";
import { isOfItemType } from "../../item/wvItem.js";
import WvI18n, {
  I18nAmmoContainerTypes,
  I18nCalibers,
  I18nDamageFallOffTypes,
  I18nSkills
} from "../../wvI18n.js";
import Prompt from "../prompt.js";
import WvItemSheet, { SheetData as ItemSheetData } from "./wvItemSheet.js";

export default class WeaponSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("weapon-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      dragDrop: [{ dragSelector: ".weapon-attack > button[data-attack]" }],
      height: 760
    } as typeof ItemSheet["defaultOptions"]);
  }

  /** Get the weapon sheet data for a weapon. */
  static getWeaponSheetData(weapon: Weapon): SheetWeapon {
    const i18nSkills = WvI18n.skills;
    const i18nDamageFallOffTypes = WvI18n.damageFallOffTypes;
    const i18nCalibers = WvI18n.calibers;
    const i18nContainerTypes = WvI18n.ammoContainerTypes;

    return {
      attacks: Object.entries(weapon.systemData.attacks.attacks).reduce<
        Record<string, SheetAttack>
      >((obj, [name, attack]) => {
        obj[name] = {
          ap: attack.data.ap.total,
          damage: attack.damageFormula,
          dtReduction: attack.data.dtReduction,
          rounds: attack.data.rounds
        };
        return obj;
      }, {}),
      damageFallOffTypes: {
        "": "",
        ...i18nDamageFallOffTypes
      },
      displayRanges: {
        short: ranges.getDisplayRangeDistance(
          weapon.systemData.ranges.short.distance,
          weapon.actor?.data.data.specials
        ),
        medium: ranges.getDisplayRangeDistance(
          weapon.systemData.ranges.medium.distance,
          weapon.actor?.data.data.specials
        ),
        long: ranges.getDisplayRangeDistance(
          weapon.systemData.ranges.long.distance,
          weapon.actor?.data.data.specials
        )
      },
      reload: {
        caliber: i18nCalibers[weapon.systemData.reload.caliber],
        calibers: i18nCalibers,
        containerType:
          i18nContainerTypes[weapon.systemData.reload.containerType],
        containerTypes: i18nContainerTypes
      },
      skill: i18nSkills[weapon.systemData.skill],
      skills: i18nSkills,
      specials: {
        "": "",
        ...WvI18n.longSpecials
      },
      usesAmmo: weapon.systemData.reload.size.total > 0
    };
  }

  override get item(): Weapon {
    if (!isOfItemType(super.item, TYPES.ITEM.WEAPON))
      throw new Error("The used Item is not a Weapon.");

    return super.item;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element.");

    sheetForm
      .querySelectorAll("button.weapon-attack-execute[data-attack]")
      .forEach((element) =>
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen.");
          this.onClickAttackExecute(event);
        })
      );

    sheetForm
      .querySelectorAll(".weapon-attack-control[data-action=create]")
      .forEach((element) =>
        element.addEventListener(
          "click",
          this.onClickCreateWeaponAttack.bind(this)
        )
      );

    sheetForm
      .querySelectorAll(".weapon-attack-control[data-action=delete]")
      .forEach((element) =>
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen.");
          this.onClickDeleteWeaponAttack(event);
        })
      );

    if (this.item.hasEnabledCompendiumLink)
      this.disableCompendiumLinkInputs(sheetForm);
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

  protected override _updateObject(
    event: Event,
    formData: Record<string, unknown>
  ): Promise<unknown> {
    this.addAttackRenameUpdateData(formData);
    return super._updateObject(event, formData);
  }

  /** Handle a click event on an Attack execute button. */
  protected async onClickAttackExecute(event: MouseEvent): Promise<void> {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const attackName = event.target.dataset.attack;
    if (!attackName) return;

    const attack = this.item.systemData.attacks.attacks[attackName];
    if (!attack) return;

    attack.execute({ whisperToGms: event.ctrlKey });
  }

  /** Handle a click click event on a create weapon attack button. */
  protected async onClickCreateWeaponAttack(): Promise<void> {
    const newName = await Prompt.getString({
      label: getGame().i18n.localize("wv.system.misc.name")
    });

    if (this.item.systemData.attacks.sources[newName]) {
      ui?.notifications?.error(
        getGame().i18n.format("wv.system.messages.attackAlreadyExists", {
          name: newName
        })
      );
      return;
    }

    this.item.update({
      data: {
        attacks: { sources: { [newName]: this.getDefaultAttackSource() } }
      }
    });
  }

  /** Get the default attack source for newly created attacks. */
  protected getDefaultAttackSource(): AttackSource {
    return { ...ATTACK_JSON_SCHEMA.default };
  }

  /** Handle a click click event on a delete weapon attack button. */
  protected onClickDeleteWeaponAttack(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const attackName = event.target.dataset.attack;
    if (!attackName) return;

    const attack = this.item.systemData.attacks.attacks[attackName];
    if (attack === undefined) {
      ui?.notifications?.error(
        getGame().i18n.format("wv.system.messages.attackNotFound", {
          name: attackName
        })
      );
      return;
    }

    this.item.update({
      data: { attacks: { sources: { [`-=${attackName}`]: {} } } }
    });
  }

  /** Modify the update data if an attack rename occurred. */
  protected addAttackRenameUpdateData(formData: Record<string, unknown>) {
    for (const name in formData) {
      const match = /^sheet\.attacks\.name\.(.*)$/.exec(name);
      if (!match || !match[1]) continue;

      const oldAttackName = match[1];
      const newAttackName = formData[name];
      if (typeof newAttackName !== "string") continue;
      if (oldAttackName === newAttackName) continue;

      const oldAttack = this.item.systemData.attacks.sources[oldAttackName];
      const newAttack = this.item.systemData.attacks.sources[newAttackName];
      if (newAttack !== undefined) {
        ui?.notifications?.error(
          getGame().i18n.format("wv.system.messages.attackAlreadyExists", {
            name: newAttackName
          })
        );
      } else if (oldAttack === undefined) {
        ui?.notifications?.error(
          getGame().i18n.format("wv.system.messages.attackNotFound", {
            name: oldAttackName
          })
        );
      } else {
        formData[`data.attacks.sources.-=${oldAttackName}`] = null;
        formData[`data.attacks.sources.${newAttackName}`] = oldAttack;
      }
    }
  }

  protected override disableCompendiumLinkInputs(form: HTMLFormElement): void {
    super.disableCompendiumLinkInputs(form);
    form
      .querySelectorAll(".weapon-attack-control[data-action]")
      .forEach((element) => element.setAttribute("disabled", ""));
  }
}

interface SheetAttack {
  ap: number;
  damage: string;
  dtReduction: number | undefined;
  rounds: number | undefined;
}

export interface SheetWeapon {
  attacks: Record<string, SheetAttack>;
  damageFallOffTypes: I18nDamageFallOffTypes & { "": string };
  displayRanges: {
    short: string;
    medium: string;
    long: string;
  };
  reload: {
    caliber: string;
    calibers: I18nCalibers;
    containerType: string;
    containerTypes: I18nAmmoContainerTypes;
  };
  skill: string;
  skills: I18nSkills;
  specials: Record<"" | SpecialName, string>;
  usesAmmo: boolean;
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetWeapon;
}

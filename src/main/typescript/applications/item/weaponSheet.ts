import { type SpecialName, TYPES } from "../../constants.js";
import { AttacksProperties, getDefaultAttack } from "../../data/item/weapon/attack/properties.js";
import type { WeaponAttackDragData } from "../../dragData.js";
import type Weapon from "../../item/weapon.js";
import { isOfItemType } from "../../item/wvItem.js";
import { LOG } from "../../systemLogger.js";
import WvI18n, {
  getI18n,
  type I18nAmmoContainerTypes,
  type I18nCalibers,
  type I18nDamageFallOffTypes,
  type I18nSkills
} from "../../wvI18n.js";
import { StringPrompt } from "../prompt.js";
import WvItemSheet, { type SheetData as ItemSheetData } from "./wvItemSheet.js";

export default class WeaponSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("weapon-sheet");
    defaultOptions.height = 500;
    defaultOptions.width = 800;
    return defaultOptions;
  }

  /** Get the weapon sheet data for a weapon. */
  static getWeaponSheetData(weapon: Weapon): SheetWeapon {
    const i18nSkills = WvI18n.skills;
    const i18nDamageFallOffTypes = WvI18n.damageFallOffTypes;
    const i18nCalibers = WvI18n.calibers;
    const i18nContainerTypes = WvI18n.ammoContainerTypes;

    return {
      damageFallOffTypes: {
        "": "",
        ...i18nDamageFallOffTypes
      },
      displayRanges: {
        short: weapon.system.ranges.short.distance.getDisplayRangeDistance(
          weapon.actor?.system.specials
        ),
        medium: weapon.system.ranges.medium.distance.getDisplayRangeDistance(
          weapon.actor?.system.specials
        ),
        long: weapon.system.ranges.long.distance.getDisplayRangeDistance(
          weapon.actor?.system.specials
        )
      },
      reload: {
        caliber: i18nCalibers[weapon.system.reload.caliber],
        calibers: i18nCalibers,
        containerType:
          i18nContainerTypes[weapon.system.reload.containerType],
        containerTypes: i18nContainerTypes
      },
      skill: i18nSkills[weapon.system.skill],
      skills: i18nSkills,
      specials: {
        "": "",
        ...WvI18n.longSpecials
      }
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
      .querySelectorAll("button[data-weapon-attack-name]")
      .forEach((element) => {
        element.addEventListener("click", (event) =>
          this.onClickAttackExecute(event)
        );
      });

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
        element.addEventListener("click", (event) =>
          this.onClickDeleteWeaponAttack(event)
        )
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

    const attackKey = target.dataset["attack"];
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
    for (const rangeName of ["short", "medium", "long"]) {
      this.sanitizeTags(formData, `data.ranges.${rangeName}.tags`);
    }
    this.item.system.attacks.forEach((attack) => {
      this.sanitizeTags(formData, `data.attacks.sources.${attack.name}.tags`);
    });
    return super._updateObject(event, formData);
  }

  protected override disableCompendiumLinkInputs(form: HTMLFormElement): void {
    super.disableCompendiumLinkInputs(form);
    form
      .querySelectorAll(".weapon-attack-control[data-action]")
      .forEach((element) => element.setAttribute("disabled", ""));
  }

  /** Handle a click event on an Attack execute button. */
  protected async onClickAttackExecute(event: Event): Promise<void> {
    if (!(event.target instanceof HTMLElement)) {
      LOG.warn("The target was not an HTMLElement.");
      return;
    }

    const attackElement = event.target.closest("[data-weapon-attack-name]");
    if (!(attackElement instanceof HTMLElement)) {
      LOG.warn("Could not get the attack element.");
      return;
    }

    const attackName = attackElement.dataset["weaponAttackName"];
    if (!attackName) {
      LOG.warn("Could not get the attack name.");
      return;
    }

    AttacksProperties.executeByName(this.item.system.attacks, attackName)
  }

  /** Handle a click click event on a create weapon attack button. */
  protected async onClickCreateWeaponAttack(): Promise<void> {
    let newName: string;
    try {
      newName = await StringPrompt.get({
        label: getI18n().localize("wv.system.misc.name")
      });
    } catch (e) {
      if (e === "closed") return;
      else throw e;
    }

    const attack = AttacksProperties.find(this.item.system.attacks, newName)
    if (attack) {
      ui?.notifications?.error(
        getI18n().format("wv.system.messages.attackAlreadyExists", {
          name: newName
        })
      );
      return;
    }

    this.item.update({
      system: {
        attacks: { sources: { [newName]: getDefaultAttack() } }
      }
    });
  }

  /** Handle a click click event on a delete weapon attack button. */
  protected onClickDeleteWeaponAttack(event: Event): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const attackName = event.target.dataset["attack"];
    if (!attackName) return;

    const attack = AttacksProperties.find(this.item.system.attacks, attackName);
    if (!attack) {
      ui?.notifications?.error(
        getI18n().format("wv.system.messages.attackNotFound", {
          name: attackName
        })
      );
      return;
    }

    this.item.update({
      system: { attacks: { sources: { [`-=${attackName}`]: {} } } }
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

      const oldAttack = this.item.system._source.attacks.find((attack) => attack.name == oldAttackName);
      const newAttack = this.item.system._source.attacks.find((attack) => attack.name == newAttackName);
      if (newAttack !== undefined) {
        ui?.notifications?.error(
          getI18n().format("wv.system.messages.attackAlreadyExists", {
            name: newAttackName
          })
        );
      } else if (oldAttack === undefined) {
        ui?.notifications?.error(
          getI18n().format("wv.system.messages.attackNotFound", {
            name: oldAttackName
          })
        );
      } else {
        formData[`data.attacks.sources.-=${oldAttackName}`] = null;
        formData[`data.attacks.sources.${newAttackName}`] = oldAttack;
      }
    }
  }
}

export interface SheetWeapon {
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
}

export interface SheetData extends ItemSheetData {
  sheet: ItemSheetData["sheet"] & SheetWeapon;
}

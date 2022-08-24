import type WvActor from "../../actor/wvActor.js";
import {
  CONSTANTS,
  EquipmentSlot,
  HANDLEBARS,
  isEquipmentSlot,
  isPhysicalItemType,
  isSkillName,
  isSpecialName,
  RaceName,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames,
  ThaumaturgySpecial,
  ThaumaturgySpecials,
  TYPES
} from "../../constants.js";
import type DragData from "../../dragData.js";
import {
  isApparelItemDragData,
  isMiscItemDragData,
  isWeaponItemDragData
} from "../../dragData.js";
import { getGame } from "../../foundryHelpers.js";
import * as helpers from "../../helpers.js";
import Apparel from "../../item/apparel.js";
import type Magic from "../../item/magic.js";
import Weapon from "../../item/weapon.js";
import WvItem from "../../item/wvItem.js";
import { WvItemProxy } from "../../item/wvItemProxy.js";
import { LOG } from "../../systemLogger.js";
import SystemRulesError from "../../systemRulesError.js";
import WvI18n, { I18nRaceNames, I18nSpecial } from "../../wvI18n.js";
import type { SheetApparel as SheetApparelData } from "../item/apparelSheet.js";
import ApparelSheet from "../item/apparelSheet.js";
import type { SheetWeapon as SheetWeaponData } from "../item/weaponSheet.js";
import WeaponSheet from "../item/weaponSheet.js";
import Prompt from "../prompt.js";
import BaseSetup from "./character/baseSetup.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet {
  static override get defaultOptions(): ActorSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push(
      ...[CONSTANTS.systemId, "document-sheet", "actor-sheet"]
    );
    defaultOptions.dragDrop = [
      { dragSelector: "button[data-special]" },
      { dragSelector: "button[data-skill]" },
      { dragSelector: ".fvtt-item-table [data-item-id]" },
      { dragSelector: "[data-equipment-slot][data-item-id]" }
    ];
    defaultOptions.height = 1000;
    defaultOptions.scrollY = [".content"];
    defaultOptions.tabs = [
      { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
    ];
    defaultOptions.width = 900;
    return defaultOptions;
  }

  constructor(
    object: WvActor,
    options?: Partial<ActorSheet.Options> | undefined
  ) {
    super(object, options);

    const defaultOptions = WvActorSheet.defaultOptions;
    if (!options?.height) {
      const height = this.limited ? "auto" : defaultOptions.height;
      this.options.height = height;
      this.position.height = height;
    }
    if (!options?.width) {
      const width = this.limited ? 600 : defaultOptions.width;
      this.options.width = width;
      this.position.width = width;
    }
  }

  override get template(): string {
    const sheetName = (this.limited ? "limitedA" : "a") + "ctorSheet.hbs";
    return `${CONSTANTS.systemPath}/handlebars/actors/${sheetName}`;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element.");

    ["change", "submit"].forEach((eventType) => {
      sheetForm.addEventListener(eventType, () => sheetForm.reportValidity());
    });

    sheetForm.addEventListener("dragend", () => this.resetEquipmentSlots());

    // setup windows
    sheetForm
      .querySelector('button[data-action="initial-setup"]')
      ?.addEventListener("click", this.onClickInitialSetup.bind(this));

    // stat rolls
    sheetForm.querySelectorAll("button[data-special]").forEach((element) => {
      element.addEventListener("click", (event) =>
        this.onClickRollSpecial(event)
      );
    });
    sheetForm.querySelectorAll("button[data-skill]").forEach((element) => {
      element.addEventListener("click", (event) =>
        this.onClickRollSkill(event)
      );
    });

    // item handling
    sheetForm
      .querySelectorAll("button[data-action=create]")
      .forEach((element) => {
        element.addEventListener("click", (event) =>
          this.onClickCreateItem(event)
        );
      });
    sheetForm
      .querySelectorAll("button[data-action=edit]")
      .forEach((element) => {
        element.addEventListener("click", (event) =>
          this.onClickEditItem(event)
        );
      });
    sheetForm
      .querySelectorAll("button[data-action=delete]")
      .forEach((element) => {
        element.addEventListener("click", (event) =>
          this.onClickDeleteItem(event)
        );
      });
    sheetForm
      .querySelectorAll("button[data-weapon-attack-name]")
      .forEach((element) => {
        element.addEventListener("click", (event) =>
          this.onClickAttackExecute(event)
        );
      });
    sheetForm
      .querySelectorAll("input[data-action=edit-amount]")
      .forEach((element) => {
        element.addEventListener("change", (event) => {
          this.onChangeItemAmount(event);
        });
      });
  }

  override async getData(): Promise<SheetData> {
    const i18nRaceNames = WvI18n.raceNames;
    const i18nSpecials = WvI18n.specials;
    const i18nSkills = WvI18n.skills;
    console.log("sntoaehu");

    const actorReadiedItem = this.actor.readiedItem;
    const readiedItem =
      actorReadiedItem instanceof Weapon
        ? this.toSheetWeapon(actorReadiedItem)
        : actorReadiedItem?.toObject(false) ?? null;
    const armor =
      this.actor.armor instanceof Apparel
        ? this.toSheetApparel(this.actor.armor)
        : null;
    const clothing =
      this.actor.clothing instanceof Apparel
        ? this.toSheetApparel(this.actor.clothing)
        : null;
    const eyes =
      this.actor.eyesApparel instanceof Apparel
        ? this.toSheetApparel(this.actor.eyesApparel)
        : null;
    const mouth =
      this.actor.mouthApparel instanceof Apparel
        ? this.toSheetApparel(this.actor.mouthApparel)
        : null;
    const belt =
      this.actor.beltApparel instanceof Apparel
        ? this.toSheetApparel(this.actor.beltApparel)
        : null;

    let totalValue = 0;
    let totalWeight = 0;
    const items = this.actor.items
      .filter(
        (item): item is StoredDocument<WvItem> =>
          typeof item.id === "string" && isPhysicalItemType(item.type)
      )
      .sort((a, b) => (a.data.sort ?? 0) - (b.data.sort ?? 0))
      .map((item) => {
        totalValue += item.totalValue ?? 0;
        totalWeight += item.totalWeight ?? 0;

        return {
          id: item.id,
          img: item.img,
          name: item.name,
          value: item.value,
          weight: item.weight,
          amount: item.amount,
          totalValue: helpers.toFixed(item.totalValue),
          totalWeight: helpers.toFixed(item.totalWeight)
        };
      });

    const spells = this.actor.items
      .filter(
        (item): item is StoredDocument<Magic> =>
          typeof item.id === "string" && item.type === TYPES.ITEM.MAGIC
      )
      .sort((a, b) => (a.data.sort ?? 0) - (b.data.sort ?? 0))
      .map((spell) => {
        return {
          id: spell.id,
          img: spell.img,
          name: spell.name,
          apCost: spell.data.data.apCost.total,
          strainCost: spell.data.data.strainCost.total
        };
      });
    console.log(spells);

    const sheetData: SheetData = {
      ...(await super.getData()),
      sheet: {
        background: {
          raceName: i18nRaceNames[this.actor.data.data.background.raceName],
          raceNames: Object.entries(i18nRaceNames)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .reduce((racesNames, [raceName, i18nRaceName]) => {
              racesNames[raceName as RaceName] = i18nRaceName;
              return racesNames;
            }, {} as I18nRaceNames)
        },
        bounds: CONSTANTS.bounds,
        equipment: {
          readyItemCost: CONSTANTS.rules.equipment.readyItemCost,
          readiedItem,
          weaponSlots: this.actor.weaponSlotWeapons.map((weapon) =>
            weapon ? this.toSheetWeapon(weapon) : null
          ),
          armor,
          clothing,
          eyes,
          mouth,
          belt
        },
        inventory: {
          items,
          totalValue: helpers.toFixed(
            totalValue + this.actor.data.data.equipment.caps
          ),
          totalWeight: helpers.toFixed(totalWeight)
        },
        leveling: {
          totalSkillPoints: SkillNames.reduce(
            (points, skillName) =>
              this.actor.data.data.skills[skillName].source + points,
            0
          )
        },
        parts: {
          apparelSlot: HANDLEBARS.partPaths.actor.apparelSlot,
          background: HANDLEBARS.partPaths.actor.background,
          effects: HANDLEBARS.partPaths.actor.effects,
          equipment: HANDLEBARS.partPaths.actor.equipment,
          header: HANDLEBARS.partPaths.actor.header,
          inventory: HANDLEBARS.partPaths.actor.inventory,
          magic: HANDLEBARS.partPaths.actor.magic,
          stats: HANDLEBARS.partPaths.actor.stats,
          weaponSlot: HANDLEBARS.partPaths.actor.weaponSlot
        },
        specials: SpecialNames.reduce((specials, specialName) => {
          const special = this.actor.data.data.specials[specialName];
          specials[specialName] = {
            ...special,
            permTotal: special.permTotal,
            tempTotal: special.tempTotal,
            long: i18nSpecials[specialName].long,
            short: i18nSpecials[specialName].short
          };
          return specials;
        }, {} as Record<SpecialName, SheetSpecial>),
        skills: SkillNames.reduce((skills, skillName) => {
          const specialName =
            skillName === "thaumaturgy"
              ? this.actor.data.data.magic.thaumSpecial
              : CONSTANTS.skillSpecials[skillName];
          skills[skillName] = {
            name: i18nSkills[skillName],
            ranks: this.actor.data.data.leveling.skillRanks[skillName],
            special: i18nSpecials[specialName].short,
            total: this.actor.data.data.skills[skillName]?.total
          };
          return skills;
        }, {} as Record<SkillName, SheetSkill>),
        systemGridUnit: getGame().system.data.gridUnits,
        magic: {
          thaumSpecials: ThaumaturgySpecials.reduce(
            (thaumSpecials, thaumSpecialName) => {
              thaumSpecials[thaumSpecialName] =
                i18nSpecials[thaumSpecialName].long;
              return thaumSpecials;
            },
            {} as Record<ThaumaturgySpecial, string>
          ),
          spells
        },
        effects: this.actor.items
          .filter(
            (item): item is StoredDocument<WvItem> =>
              typeof item.id === "string" && item.type === TYPES.ITEM.EFFECT
          )
          .map((item) => ({
            id: item.id,
            img: item.img,
            name: item.name
          }))
      }
    };

    return sheetData;
  }

  override _onDragStart(event: DragEvent): void {
    const listenerElement = event.currentTarget;
    if (!(listenerElement instanceof HTMLElement))
      throw new Error("The listener was not an HTMLElement.");

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    if (event.target.classList.contains("content-link")) return;

    let dragData: DragData | null = null;
    const baseDragData = {
      actorId: this.actor.id,
      sceneId: this.actor.isToken ? canvas?.scene?.id : null,
      tokenId: this.actor.isToken ? this.actor.token?.id : null,
      pack: this.actor.pack
    };

    if (
      listenerElement.dataset.special &&
      isSpecialName(listenerElement.dataset.special)
    ) {
      dragData = {
        ...baseDragData,
        type: "special",
        specialName: listenerElement.dataset.special
      };
    }

    if (
      listenerElement.dataset.skill &&
      isSkillName(listenerElement.dataset.skill)
    ) {
      dragData = {
        ...baseDragData,
        type: "skill",
        specialName: listenerElement.dataset.skill
      };
    }

    if (listenerElement.dataset.itemId) {
      const item = this.actor.items.get(listenerElement.dataset.itemId);
      if (item) {
        dragData = {
          ...baseDragData,
          type: "Item",
          data: item.data
        };
      }
    }

    if (listenerElement.dataset.effectId) {
      const effect = this.actor.effects.get(listenerElement.dataset.effectId);
      if (effect) {
        dragData = {
          ...baseDragData,
          type: "ActiveEffect",
          data: effect.data
        };
      }
    }

    if (dragData) {
      this.prepareEquipmentSlots(dragData);
      event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
    }
  }

  override async _onDropItem(
    event: DragEvent,
    data: ActorSheet.DropData.Item
  ): Promise<unknown> {
    if (!this.actor.isOwner) return false;

    const item = await WvItemProxy.fromDropData(data);
    if (!(item instanceof WvItem))
      throw new Error("The item was not created successfully.");

    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    if (await this._isFromSameActor(data)) {
      const equipmentSlot = this.getDropEquipmentSlot(event.target);

      if (equipmentSlot) {
        this.onDropEquipmentSlot(
          equipmentSlot,
          itemData,
          this.isDropOnQuickSlot(event.target)
        );
        return;
      }

      return this._onSortItem(event, itemData);
    }

    // Create the owned item
    return this._onDropItemCreate(itemData);
  }

  // @ts-expect-error It is really hard to get the return sig right, so we just
  // ignore this. The return value isn't used anyway.
  override _onSortItem(
    event: DragEvent,
    itemData: foundry.data.ItemData["_source"]
  ): unknown {
    if (itemData._id === null) throw new Error("The ID was null.");

    // Get the drag source and drop target
    const items = this.actor.items;
    const source = items.get(itemData._id, { strict: true });

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const dropTarget = event.target.closest("[data-item-id]");
    if (!(dropTarget instanceof HTMLElement)) {
      LOG.debug("Could not find a parent with data-item-id.");
      return;
    }

    if (typeof dropTarget.dataset.itemId !== "string")
      throw new Error("The target did not have an Item ID.");

    const target = items.get(dropTarget.dataset.itemId, { strict: true });

    // Don't sort on yourself
    if (source.id === target.id) return;

    if (!(dropTarget.parentElement instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    // Identify sibling items based on adjacent HTML elements
    const siblings: WvItem[] = [];
    for (let i = 0; i < dropTarget.parentElement.children.length; i++) {
      const el = dropTarget.parentElement.children.item(i);
      if (!(el instanceof HTMLElement))
        throw new Error("The el was not an HTMLElement.");

      const siblingId = el.dataset.itemId;
      if (siblingId && siblingId !== source.id)
        siblings.push(items.get(siblingId, { strict: true }));
    }

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(source, {
      target,
      siblings
    });
    const updateData = sortUpdates.map((u) => {
      const update: { sort: number; _id?: string | null | undefined } =
        u.update;
      update._id = u.target?.data._id;
      return update;
    });

    // Perform the update
    return this.actor.updateEmbeddedDocuments("Item", updateData);
  }

  /** Check whether the sheet is limited for the current user. */
  get limited(): boolean {
    const isGm = getGame().user?.isGM ?? false;
    return !isGm && this.actor.limited;
  }

  protected toSheetApparel(apparel: Apparel): SheetApparel {
    return {
      ...apparel.toObject(false),
      sheet: ApparelSheet.getApparelSheetData(apparel)
    };
  }

  /** Transform a Weapon into a sheet weapon. */
  protected toSheetWeapon(weapon: Weapon): SheetWeapon {
    return {
      ...weapon.toObject(false),
      sheet: WeaponSheet.getWeaponSheetData(weapon)
    };
  }

  /** Open the initial setup application. */
  protected onClickInitialSetup() {
    new BaseSetup(this.actor).render(true);
  }

  /** Handle a click event on the SPECIAL roll buttons. */
  protected async onClickRollSpecial(event: Event): Promise<void> {
    event.preventDefault();

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const special = event.target.dataset.special;
    if (!special || !isSpecialName(special)) {
      LOG.warn(`Could not get the SPECIAL name for a roll.`);
      return;
    }

    try {
      this.actor.rollSpecial(
        special,
        await Prompt.get({
          modifier: {
            type: "number",
            label: WvI18n.getSpecialModifierDescription(special),
            value: 0,
            min: -100,
            max: 100
          },
          whisperToGms: {
            type: "checkbox",
            label: getGame().i18n.localize("wv.system.rolls.whisperToGms"),
            value: getGame().user?.isGM
          }
        })
      );
    } catch (e) {
      if (e !== "closed") throw e;
    }
  }

  /** Handle a click event on the Skill roll buttons. */
  protected async onClickRollSkill(event: Event): Promise<void> {
    event.preventDefault();

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const skill = event.target.dataset.skill;
    if (!skill || !isSkillName(skill)) {
      LOG.warn("Could not get the Skill name for a Skill roll.");
      return;
    }

    try {
      this.actor.rollSkill(
        skill,
        await Prompt.get({
          modifier: {
            type: "number",
            label: WvI18n.getSkillModifierDescription(skill),
            value: 0,
            min: -100,
            max: 100
          },
          whisperToGms: {
            type: "checkbox",
            label: getGame().i18n.localize("wv.system.rolls.whisperToGms"),
            value: getGame().user?.isGM
          }
        })
      );
    } catch (e) {
      if (e !== "closed") throw e;
    }
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

    const weaponElement = event.target.closest("[data-item-id]");
    if (!(weaponElement instanceof HTMLElement)) {
      LOG.warn("Could not get the weapon element.");
      return;
    }

    const attackName = attackElement.dataset.weaponAttackName;
    if (!attackName) {
      LOG.warn("Could not get the attack name.");
      return;
    }

    const weaponId = weaponElement.dataset.itemId;
    if (!weaponId) {
      LOG.warn("Could not get the weapon ID.");
      return;
    }

    if (weaponId !== this.actor.data.data.equipment.readiedItemId) {
      LOG.warn("The weapon was not readied.");
      return;
    }

    const weapon = this.actor.items.get(weaponId);
    if (!(weapon instanceof Weapon)) {
      LOG.warn("Could not find the weapon on the actor.");
      return;
    }

    const attack = weapon.data.data.attacks.attacks[attackName];
    if (!attack) {
      LOG.warn("Could not find the attack on the weapon.");
      return;
    }

    attack.execute();
  }

  /** Handle a click event on a create item button. */
  protected async onClickCreateItem(event: Event): Promise<void> {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    let data: ConstructorParameters<typeof Item>[0];
    if (event.target.dataset.type === TYPES.ITEM.EFFECT) {
      data = {
        name: getGame().i18n.format("wv.system.misc.newName", {
          what: getGame().i18n.localize("wv.system.effect.singular")
        }),
        type: event.target.dataset.type
      };
    } else if (event.target.dataset.type === TYPES.ITEM.MISC) {
      data = {
        name: getGame().i18n.format("wv.system.misc.newName", {
          what: getGame().i18n.localize("wv.system.item.singular")
        }),
        type: event.target.dataset.type
      };
    } else return;

    const item = await Item.create(data, { parent: this.actor });
    item?.sheet?.render(true);
  }

  /** Handle a click event on an edit item button. */
  protected onClickEditItem(event: Event): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest("[data-item-id]");
    if (!(itemElement instanceof HTMLElement))
      throw new Error("The item element parent is not an HTMLElement.");

    const id = itemElement.dataset.itemId;
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item && item.sheet) {
      item.sheet.render(true);
    }
  }

  /** Handle a click event on a delete item button. */
  protected onClickDeleteItem(event: Event): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest("[data-item-id]");
    if (!(itemElement instanceof HTMLElement))
      throw new Error("The item element parent is not an HTMLElement.");

    const id = itemElement.dataset.itemId;
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item) {
      item.delete();
      this.render();
    }
  }

  /** Handle change events for chaning an item's amount. */
  protected onChangeItemAmount(event: Event): void {
    if (!(event.target instanceof HTMLInputElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest("[data-item-id]");
    if (!(itemElement instanceof HTMLElement))
      throw new Error("The item element parent is not an HTMLElement.");

    const id = itemElement.dataset.itemId;
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item) {
      item.update({ data: { amount: event.target.valueAsNumber } });
      item.render();
      this.render();
    }
  }

  /** Handle Item drops onto equipment slots. */
  protected async onDropEquipmentSlot(
    slot: EquipmentSlot,
    data: foundry.data.ItemData["_source"],
    useQuickSlot = false
  ): Promise<void> {
    try {
      switch (slot) {
        case "readiedItem":
          await this.actor.readyItem(data._id, { useQuickSlot });
          break;
        case "weaponSlot1":
          await this.actor.slotWeapon(data._id, 1);
          break;
        case "weaponSlot2":
          await this.actor.slotWeapon(data._id, 2);
          break;
        case "armor":
        case "clothing":
        case "eyes":
        case "mouth":
        case "belt":
          await this.actor.equipApparel(data._id);
      }
    } catch (e) {
      if (e instanceof SystemRulesError && e.key) {
        ui.notifications?.error(e.key, { localize: true });
      }
    }
  }

  /**
   * Get the equipment slot name of a drop target, null if it couldn't be
   * determined.
   */
  protected getDropEquipmentSlot(
    target: EventTarget | null
  ): EquipmentSlot | null {
    if (!(target instanceof HTMLElement)) return null;

    const slotElement = target.closest("[data-equipment-slot]");
    if (!(slotElement instanceof HTMLElement)) return null;

    const slotName = slotElement.dataset.equipmentSlot;
    if (typeof slotName !== "string") return null;

    if (isEquipmentSlot(slotName)) return slotName;

    return null;
  }

  /** Whether the drop target was the quick slot use slot. */
  protected isDropOnQuickSlot(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;

    const slotElement = target.closest("[data-equipment-slot-extra=quickSlot]");
    return slotElement !== null;
  }

  /** Prepare the equipment slots depending on the drag data. */
  protected prepareEquipmentSlots(dragData: DragData): void {
    const slotsToAllow: EquipmentSlot[] = [];

    if (isWeaponItemDragData(dragData)) {
      if (dragData.data._id !== this.actor.readiedItem?.id) {
        slotsToAllow.push("readiedItem");

        if (
          this.actor.inCombat &&
          dragData.data._id !== null &&
          this.actor.data.data.equipment.weaponSlotIds
            .filter((id): id is string => typeof id === "string")
            .includes(dragData.data._id)
        ) {
          this.markReadySlot("weapon-slotable");
        }
      }

      if (!this.actor.inCombat) {
        if (dragData.data._id !== null) {
          if (
            this.actor.data.data.equipment.weaponSlotIds[0] !==
            dragData.data._id
          ) {
            slotsToAllow.push("weaponSlot1");
          }
          if (
            this.actor.data.data.equipment.weaponSlotIds[1] !==
            dragData.data._id
          ) {
            slotsToAllow.push("weaponSlot2");
          }
        }
      }
    } else if (isMiscItemDragData(dragData)) {
      if (dragData.data._id !== this.actor.readiedItem?.id) {
        slotsToAllow.push("readiedItem");

        if (this.actor.inCombat) {
          this.markReadySlot("quick-slotable");
        }
      }
    } else if (isApparelItemDragData(dragData) && !this.actor.inCombat) {
      const apparels = this.actor.equippedApparel;
      const blockedSlots = this.actor.blockedApparelSlots;

      if (
        !apparels.map((apparel) => apparel.id).includes(dragData.data._id) &&
        !blockedSlots.includes(dragData.data.data.slot)
      ) {
        slotsToAllow.push(dragData.data.data.slot);
      }
    }

    this.markEquipmentSlots(...slotsToAllow);
  }

  /**
   * Mark the equipment slots as slotable or not. The given slots are marked as
   * slotable, the rest is marked as non-slotable.
   * @param slots - the slots to mark as slotable
   */
  protected markEquipmentSlots(...slots: EquipmentSlot[]): void {
    const form = this._element ? this._element[0] : null;
    if (!form) return;

    form.querySelectorAll(`[data-equipment-slot]`).forEach((slotElement) => {
      if (!(slotElement instanceof HTMLElement)) return;
      if (slots.includes(slotElement.dataset.equipmentSlot as EquipmentSlot)) {
        slotElement.classList.add("slotable");
        if (this.actor.inCombat) slotElement.classList.add("in-combat");
      } else {
        slotElement.classList.add("not-slotable");
      }
    });
  }

  /**
   * Mark the readied item slot with the given types, removing any already set.
   */
  protected markReadySlot(
    ...types: ("slotable" | "quick-slotable" | "weapon-slotable")[]
  ): void {
    const form = this._element ? this._element[0] : null;
    if (!form) return;

    form
      .querySelectorAll("[data-equipment-slot=readiedItem]")
      .forEach((slotElement) => {
        if (!(slotElement instanceof HTMLElement)) return;

        slotElement.classList.remove(
          "slotable",
          "quick-slotable",
          "weapon-slotable"
        );
        slotElement.classList.add(...types);
      });
  }

  /** Reset alterations to equipment slots. */
  protected resetEquipmentSlots(): void {
    const form = this._element ? this._element[0] : null;
    if (!form) return;

    form.querySelectorAll(`[data-equipment-slot]`).forEach((slotElement) => {
      if (!(slotElement instanceof HTMLElement)) return;

      slotElement.classList.remove(
        "in-combat",
        "not-slotable",
        "slotable",
        "quick-slotable",
        "weapon-slotable"
      );
    });
  }
}

interface SheetBackground {
  raceName: string;
  raceNames: I18nRaceNames;
}

interface SheetBound {
  points: {
    min: number;
  };
}

interface SheetBounds {
  skills: SheetBound;
}

interface SheetEffect {
  id: string;
  img: string | null;
  name: string | null;
}

interface SheetItem {
  id: string;
  img: string | null;
  name: string | null;
  value: number | undefined;
  weight: number | undefined;
  amount: number | undefined;
  totalValue: string | undefined;
  totalWeight: string | undefined;
}

interface SheetEquipment {
  readyItemCost: {
    direct: number;
    fromSlot: number;
  };
  readiedItem: ReadiedItem | null;
  weaponSlots: (SheetWeapon | null)[];
  armor: SheetApparel | null;
  clothing: SheetApparel | null;
  eyes: SheetApparel | null;
  mouth: SheetApparel | null;
  belt: SheetApparel | null;
}

type ReadiedItem = ReturnType<WvItem["toObject"]> | SheetWeapon;

type SheetApparel = ReturnType<Apparel["toObject"]> & {
  sheet: SheetApparelData;
};

type SheetWeapon = ReturnType<Weapon["toObject"]> & {
  sheet: SheetWeaponData;
};

interface SheetInventory {
  items: SheetItem[];
  totalValue: string;
  totalWeight: string;
}

interface SheetLeveling {
  totalSkillPoints: number;
}

interface SheetMagic {
  thaumSpecials: Record<ThaumaturgySpecial, string>;
  spells: SheetSpell[];
}

type SheetSpell = {
  id: string;
  apCost: number;
  strainCost: number;
  img: string | null;
  name: string | null;
};

interface SheetSpecial extends I18nSpecial {
  points: number;
  permTotal: number;
  tempTotal: number;
}

interface SheetSkill {
  name: string;
  ranks: number;
  special: string;
  total: number | undefined;
}

interface SheetData extends ActorSheet.Data {
  sheet: {
    background: SheetBackground;
    bounds: SheetBounds;
    effects: SheetEffect[];
    equipment: SheetEquipment;
    inventory: SheetInventory;
    leveling: SheetLeveling;
    magic: SheetMagic;
    parts: {
      apparelSlot: string;
      background: string;
      effects: string;
      equipment: string;
      header: string;
      inventory: string;
      magic: string;
      stats: string;
      weaponSlot: string;
    };
    skills: Record<SkillName, SheetSkill>;
    specials: Record<SpecialName, SheetSpecial>;
    systemGridUnit: string | undefined;
  };
}

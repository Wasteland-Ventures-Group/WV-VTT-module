import {
  CONSTANTS,
  EquipmentSlot,
  HANDLEBARS,
  isEquipmentSlot,
  isPhysicalItemType,
  isSkillName,
  isSpecialName,
  Race,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames,
  ThaumaturgySpecial,
  ThaumaturgySpecials,
  TYPES
} from "../../constants.js";
import type { Special } from "../../data/actor/character/specials/properties.js";
import type DragData from "../../dragData.js";
import {
  isApparelItemDragData,
  isMiscItemDragData,
  isWeaponItemDragData
} from "../../dragData.js";
import { getGame } from "../../foundryHelpers.js";
import * as helpers from "../../helpers.js";
import type Weapon from "../../item/weapon.js";
import WvItem from "../../item/wvItem.js";
import { LOG } from "../../systemLogger.js";
import SystemRulesError from "../../systemRulesError.js";
import WvI18n, { I18nRaces, I18nSpecial } from "../../wvI18n.js";
import Prompt from "../prompt.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet {
  static override get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "actor-sheet"],
      dragDrop: [
        { dragSelector: "button[data-special]" },
        { dragSelector: "button[data-skill]" },
        { dragSelector: ".fvtt-item-table .fvtt-item" }
      ],
      height: 1000,
      scrollY: [".content"],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      width: 700
    } as typeof ActorSheet["defaultOptions"]);
  }

  override get template(): string {
    const isGm = getGame().user?.isGM ?? false;
    const showLimited = !isGm && this.actor.limited;
    const sheetName = (showLimited ? "limitedA" : "a") + "ctorSheet.hbs";
    return `${CONSTANTS.systemPath}/handlebars/actors/${sheetName}`;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element!");

    ["change", "submit"].forEach((eventType) => {
      sheetForm.addEventListener(eventType, () => sheetForm.reportValidity());
    });

    sheetForm.addEventListener("dragend", () => this.resetEquipmentSlots());

    // stat rolls
    sheetForm.querySelectorAll("button[data-special]").forEach((element) => {
      element.addEventListener("click", (event) => {
        if (!(event instanceof MouseEvent))
          throw new Error("This should not happen!");
        this.onClickRollSpecial(event);
      });
    });
    sheetForm.querySelectorAll("button[data-skill]").forEach((element) => {
      element.addEventListener("click", (event) => {
        if (!(event instanceof MouseEvent))
          throw new Error("This should not happen!");
        this.onClickRollSkill(event);
      });
    });

    // item handling
    sheetForm
      .querySelectorAll("button[data-action=create]")
      .forEach((element) => {
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen!");
          this.onClickCreateItem(event);
        });
      });
    sheetForm
      .querySelectorAll("button[data-action=edit]")
      .forEach((element) => {
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen!");
          this.onClickEditItem(event);
        });
      });
    sheetForm
      .querySelectorAll("button[data-action=delete]")
      .forEach((element) => {
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen!");
          this.onClickDeleteItem(event);
        });
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
    const racesI18ns = WvI18n.races;
    const specialI18ns = WvI18n.specials;
    const skillI18ns = WvI18n.skills;

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

    const sheetData: SheetData = {
      ...(await super.getData()),
      sheet: {
        background: {
          race: racesI18ns[this.actor.data.data.background.race],
          races: Object.entries(racesI18ns)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .reduce((races, [race, name]) => {
              races[race as Race] = name;
              return races;
            }, {} as I18nRaces)
        },
        bounds: CONSTANTS.bounds,
        equipment: {
          readyItemCost: CONSTANTS.rules.equipment.readyItemCost,
          readiedItem: this.actor.readiedItem,
          weaponSlots: this.actor.weaponSlotWeapons
        },
        inventory: {
          items,
          totalValue: helpers.toFixed(
            totalValue + this.actor.data.data.equipment.caps
          ),
          totalWeight: helpers.toFixed(totalWeight)
        },
        parts: {
          background: HANDLEBARS.partPaths.actor.background,
          effects: HANDLEBARS.partPaths.actor.effects,
          equipment: HANDLEBARS.partPaths.actor.equipment,
          header: HANDLEBARS.partPaths.actor.header,
          inventory: HANDLEBARS.partPaths.actor.inventory,
          magic: HANDLEBARS.partPaths.actor.magic,
          stats: HANDLEBARS.partPaths.actor.stats
        },
        specials: SpecialNames.reduce((specials, specialName) => {
          specials[specialName] = {
            ...this.actor.getSpecial(specialName),
            long: specialI18ns[specialName].long,
            short: specialI18ns[specialName].short
          };
          return specials;
        }, {} as Record<SpecialName, SheetSpecial>),
        skills: SkillNames.reduce((skills, skillName) => {
          const specialName =
            skillName === "thaumaturgy"
              ? this.actor.data.data.magic.thaumSpecial
              : CONSTANTS.skillSpecials[skillName];
          skills[skillName] = {
            name: skillI18ns[skillName],
            ranks: this.actor.data.data.leveling.skillRanks[skillName],
            special: specialI18ns[specialName].short,
            total: this.actor.data.data.skills[skillName]?.total
          };
          return skills;
        }, {} as Record<SkillName, SheetSkill>),
        magic: {
          thaumSpecials: ThaumaturgySpecials.reduce(
            (thaumSpecials, thaumSpecialName) => {
              thaumSpecials[thaumSpecialName] =
                specialI18ns[thaumSpecialName].long;
              return thaumSpecials;
            },
            {} as Record<ThaumaturgySpecial, string>
          )
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
          })),
        weapons: this.actor.items
          .filter(
            (item): item is StoredDocument<WvItem> =>
              typeof item.id === "string" && item.type === TYPES.ITEM.WEAPON
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
      throw new Error("The listener was not an HTMLElement!");

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement!");

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

    const item = await WvItem.fromDropData(data);
    if (!(item instanceof WvItem))
      throw new Error("The item was not created successfully.");

    const itemData = item.toObject();

    // Handle item sorting within the same Actor
    // @ts-expect-error this isn't typed yet
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

  /** Handle a click event on the SPECIAL roll buttons. */
  protected async onClickRollSpecial(event: MouseEvent): Promise<void> {
    event.preventDefault();

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const special = event.target.dataset.special;
    if (!special || !isSpecialName(special)) {
      LOG.warn(`Could not get the SPECIAL name for a roll.`);
      return;
    }

    if (event.shiftKey) {
      const modifier = await Prompt.getNumber({
        label: WvI18n.getSpecialModifierDescription(special),
        min: -100,
        max: 100
      });
      this.actor.rollSpecial(special, {
        modifier: modifier,
        whisperToGms: event.ctrlKey
      });
    } else {
      this.actor.rollSpecial(special, { whisperToGms: event.ctrlKey });
    }
  }

  /** Handle a click event on the Skill roll buttons. */
  protected async onClickRollSkill(event: MouseEvent): Promise<void> {
    event.preventDefault();

    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const skill = event.target.dataset.skill;
    if (!skill || !isSkillName(skill)) {
      LOG.warn("Could not get the Skill name for a Skill roll.");
      return;
    }

    if (event.shiftKey) {
      const modifier = await Prompt.getNumber({
        label: WvI18n.getSkillModifierDescription(skill),
        min: -100,
        max: 100
      });
      this.actor.rollSkill(skill, {
        modifier: modifier,
        whisperToGms: event.ctrlKey
      });
    } else {
      this.actor.rollSkill(skill, { whisperToGms: event.ctrlKey });
    }
  }

  /** Handle a click event on a create item button. */
  protected async onClickCreateItem(event: MouseEvent): Promise<void> {
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
  protected onClickEditItem(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest(".fvtt-item");
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
  protected onClickDeleteItem(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest(".fvtt-item");
    if (!(itemElement instanceof HTMLElement))
      throw new Error("The item element parent is not an HTMLElement.");

    const id = itemElement.dataset.itemId;
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item) {
      item.delete();
      this.render(false);
    }
  }

  /** Handle change events for chaning an item's amount. */
  protected onChangeItemAmount(event: Event): void {
    if (!(event.target instanceof HTMLInputElement))
      throw new Error("The target was not an HTMLElement.");

    const itemElement = event.target.closest(".fvtt-item");
    if (!(itemElement instanceof HTMLElement))
      throw new Error("The item element parent is not an HTMLElement.");

    const id = itemElement.dataset.itemId;
    if (!(typeof id === "string") || !id) return;

    const amount = parseInt(event.target.value);
    if (isNaN(amount)) throw new Error("The value was not a number.");

    const item = this.actor.items.get(id);
    if (item) {
      item.update({ data: { amount } });
      item.render(false);
      this.render(false);
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
          break;
        case "clothing":
          break;
        case "eyes":
          break;
        case "mouth":
          break;
        case "belt":
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
        slotsToAllow.push("weaponSlot1", "weaponSlot2");
      }
    } else if (isMiscItemDragData(dragData)) {
      if (dragData.data._id !== this.actor.readiedItem?.id) {
        slotsToAllow.push("readiedItem");

        if (this.actor.inCombat) {
          this.markReadySlot("quick-slotable");
        }
      }
    } else if (isApparelItemDragData(dragData) && !this.actor.inCombat) {
      // TODO: do not allow slot when item is already in there
      slotsToAllow.push(dragData.data.data.slot);
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

    const slotElement = form.querySelector("[data-equipment-slot=readiedItem]");
    if (!(slotElement instanceof HTMLElement)) return;

    slotElement.classList.remove(
      "slotable",
      "quick-slotable",
      "weapon-slotable"
    );
    slotElement.classList.add(...types);
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
  race: string;
  races: I18nRaces;
}

interface SheetBound {
  points: {
    min: number;
  };
}

interface SheetBounds {
  skills: SheetBound;
  special: SheetBound;
}

interface SheetEffect {
  id: string;
  img: string | null;
  name: string | null;
}

interface SheetWeapon {
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
  readiedItem: WvItem | null;
  weaponSlots: [Weapon | null, Weapon | null];
}

interface SheetInventory {
  items: SheetItem[];
  totalValue: string;
  totalWeight: string;
}

interface SheetMagic {
  thaumSpecials: Record<ThaumaturgySpecial, string>;
}

type SheetSpecial = I18nSpecial & Special;

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
    magic: SheetMagic;
    parts: {
      background: string;
      effects: string;
      equipment: string;
      header: string;
      inventory: string;
      magic: string;
      stats: string;
    };
    skills: Record<SkillName, SheetSkill>;
    specials: Record<SpecialName, SheetSpecial>;
    weapons: SheetWeapon[];
  };
}

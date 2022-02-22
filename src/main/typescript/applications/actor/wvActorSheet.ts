import type { SkillDragData, SpecialDragData } from "../../actor/wvActor.js";
import {
  CONSTANTS,
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
import { getGame } from "../../foundryHelpers.js";
import type WvItem from "../../item/wvItem.js";
import { LOG } from "../../systemLogger.js";
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
        inventory: {
          items: [],
          totalValue: 0,
          totalWeight: 0
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

    this.actor.items
      .filter(
        (item): item is StoredDocument<WvItem> =>
          typeof item.id === "string" && item.type !== TYPES.ITEM.EFFECT
      )
      .sort((a, b) => (a.data.sort ?? 0) - (b.data.sort ?? 0))
      .forEach((item) => {
        sheetData.sheet.inventory.items.push({
          id: item.id,
          img: item.img,
          name: item.name,
          value: item.value,
          weight: item.weight,
          amount: item.amount,
          totalValue: this.getFixedTotal(item.value, item.totalValue),
          totalWeight: this.getFixedTotal(item.weight, item.totalWeight)
        });

        sheetData.sheet.inventory.totalValue += item.totalValue ?? 0;
        sheetData.sheet.inventory.totalWeight += item.totalWeight ?? 0;
      });

    return sheetData;
  }

  override _onDragStart(event: DragEvent): void {
    if (!this.actor.id) return super._onDragStart(event);

    const target = event.target;
    if (!(target instanceof HTMLElement)) return super._onDragStart(event);

    const specialName = target.dataset.special ?? "";
    const skillName = target.dataset.skill ?? "";

    if (isSpecialName(specialName)) {
      this.onDragSpecial(event, this.actor.id, specialName);
    } else if (isSkillName(skillName)) {
      this.onDragSkill(event, this.actor.id, skillName);
    } else {
      super._onDragStart(event);
    }
  }

  // @ts-expect-error It is really hard to get the return sig right, so we just
  // ignore this. The return value isn't used anyway.
  override _onSortItem(
    event: DragEvent,
    itemData: foundry.data.ItemData["_source"]
  ): unknown {
    if (itemData._id === null) throw new Error("The ID was null.");

    // Get the drag source and its siblings
    const source = this.actor.items.get(itemData._id);
    if (source === undefined)
      throw new Error(`There is no Item with ID [${itemData._id}]`);

    const siblings = this.actor.items.filter(
      (i) => i.data._id !== source.data._id
    );

    // Get the drop target
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const dropTarget = event.target?.closest("[data-item-id]");
    if (!(dropTarget instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const targetId = dropTarget ? dropTarget.dataset.itemId : null;
    const target = siblings.find((s) => s.data._id === targetId);

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(source, {
      target: target,
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

  /** Handle a drag start event on the SPECIAL roll buttons. */
  protected onDragSpecial(
    event: DragEvent,
    actorId: string,
    specialName: SpecialName
  ): void {
    const dragData: SpecialDragData = {
      actorId,
      specialName,
      type: "special"
    };

    event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
  }

  /** Handle a drag start event on the Skill roll buttons. */
  protected onDragSkill(
    event: DragEvent,
    actorId: string,
    skillName: SkillName
  ): void {
    const dragData: SkillDragData = {
      actorId,
      skillName,
      type: "skill"
    };

    event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
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

  /**
   * Get the fixed total number if both inputs are numbers. If the base is an
   * integer, the number is returned as is.
   */
  protected getFixedTotal(
    base: number | undefined,
    number: number | undefined
  ): string | undefined {
    if (typeof base === "undefined" || typeof number === "undefined")
      return undefined;

    if (Number.isInteger(base)) return number.toString();

    return number.toFixed(CONSTANTS.fixedDecimals);
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

interface SheetInventory {
  items: SheetItem[];
  totalValue: number;
  totalWeight: number;
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
    inventory: SheetInventory;
    magic: SheetMagic;
    skills: Record<SkillName, SheetSkill>;
    specials: Record<SpecialName, SheetSpecial>;
    weapons: SheetWeapon[];
  };
}

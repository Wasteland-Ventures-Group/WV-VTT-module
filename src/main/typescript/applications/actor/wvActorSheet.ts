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
import { getSkillMinPoints, getSpecialMinPoints } from "../../helpers.js";
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
        { dragSelector: "button[data-skill]" }
      ],
      height: 1000,
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      width: 700
    } as typeof ActorSheet["defaultOptions"]);
  }

  override get template(): string {
    const sheetName = (this.actor.limited ? "limitedA" : "a") + "ctorSheet.hbs";
    return `${CONSTANTS.systemPath}/handlebars/actors/${sheetName}`;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("change submit", (event) => event.target.reportValidity());

    // stat rolls
    html
      .find("button[data-special]")
      .on("click", this.onClickRollSpecial.bind(this));
    html
      .find("button[data-skill]")
      .on("click", this.onClickRollSkill.bind(this));

    // item handling
    html
      .find(".control[data-action=create]")
      .on("click", this.onClickCreateItem.bind(this));
    html
      .find(".control[data-action=edit]")
      .on("click", this.onClickEditItem.bind(this));
    html
      .find(".control[data-action=delete]")
      .on("click", this.onClickDeleteItem.bind(this));
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
        effects: [],
        weapons: []
      }
    };

    sheetData.sheet.bounds.skills.points.min = getSkillMinPoints();
    sheetData.sheet.bounds.special.points.min = getSpecialMinPoints();

    for (const item of this.actor.items) {
      if (!item.id) continue;

      if (TYPES.ITEM.EFFECT === item.data.type) {
        sheetData.sheet.effects.push({
          id: item.id,
          img: item.img,
          name: item.name
        });
      }

      if (TYPES.ITEM.WEAPON === item.data.type) {
        sheetData.sheet.weapons.push({
          id: item.id,
          img: item.img,
          name: item.name
        });
      }
    }

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
    }
  }

  /**
   * Handle a drag start event on the SPECIAL roll buttons.
   */
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

  /**
   * Handle a drag start event on the Skill roll buttons.
   */
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

  /**
   * Handle a click event on the SPECIAL roll buttons.
   */
  protected async onClickRollSpecial(event: ClickEvent): Promise<void> {
    event.preventDefault();

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

  /**
   * Handle a click event on the Skill roll buttons.
   */
  protected async onClickRollSkill(event: ClickEvent): Promise<void> {
    event.preventDefault();

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

  /**
   * Handle a click event on a create item button.
   */
  protected async onClickCreateItem(event: ClickEvent): Promise<void> {
    if (event.target.dataset.type !== TYPES.ITEM.EFFECT) return;

    const data: ConstructorParameters<typeof Item>[0] = {
      name: getGame().i18n.format("wv.system.misc.newName", {
        what: getGame().i18n.localize("wv.system.effect.singular")
      }),
      type: event.target.dataset.type
    };
    const item = await Item.create(data, { parent: this.actor });
    item?.sheet?.render(true);
  }

  /**
   * Handle a click event on an edit item button.
   */
  protected onClickEditItem(event: ClickEvent): void {
    const id = $(event.target).parents(".fvtt-item").data("id");
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item && item.sheet) {
      item.sheet.render(true);
    }
  }

  /**
   * Handle a click event on a delete item button.
   */
  protected onClickDeleteItem(event: ClickEvent): void {
    const id = $(event.target).parents(".fvtt-item").data("id");
    if (!(typeof id === "string") || !id) return;

    const item = this.actor.items.get(id);
    if (item) {
      item.delete();
      this.render(false);
    }
  }
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

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
    magic: SheetMagic;
    skills: Record<SkillName, SheetSkill>;
    specials: Record<SpecialName, SheetSpecial>;
    weapons: SheetWeapon[];
  };
}

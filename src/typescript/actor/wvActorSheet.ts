import {
  CONSTANTS,
  SkillNames,
  SpecialNames,
  ThaumaturgySpecials
} from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import { isSkillName, isSpecialName } from "../helpers.js";
import WvI18n, { I18nSpecial } from "../wvI18n.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet<
  ActorSheet.Options,
  SheetData
> {
  static override get defaultOptions(): ActorSheet.Options {
    return mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "actor-sheet"],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);

    html
      .find(".rollable[data-special]")
      .on("click", this.rollSpecial.bind(this));
    html.find(".rollable[data-skill]").on("click", this.rollSkill.bind(this));
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    const actorProps = data.actor.data.data;
    data.sheet = {};

    const specialI18ns = WvI18n.specials;
    data.sheet.specials = {};
    for (const special of SpecialNames) {
      data.sheet.specials[special] = {
        long: specialI18ns[special].long,
        short: specialI18ns[special].short,
        value: actorProps.specials[special]
      };
    }

    const skillI18ns = WvI18n.skills;
    data.sheet.skills = {};
    for (const skill of SkillNames) {
      const special: SpecialNames =
        skill === "thaumaturgy"
          ? actorProps.magic.thaumSpecial
          : CONSTANTS.skillSpecials[skill];
      data.sheet.skills[skill] = {
        name: skillI18ns[skill],
        ranks: actorProps.leveling.skillRanks[skill],
        special: specialI18ns[special].short,
        total: actorProps.skills[skill]?.total
      };
    }

    data.sheet.magic = {};
    data.sheet.magic.thaumSpecials = {};
    for (const thaumSpecial of ThaumaturgySpecials) {
      data.sheet.magic.thaumSpecials[thaumSpecial] = {
        name: specialI18ns[thaumSpecial].long,
        selected: thaumSpecial === actorProps.magic.thaumSpecial
      };
    }

    return data;
  }

  /**
   * Roll a SPECIAL for the Actor.
   */
  protected rollSpecial(event: RollEvent): void {
    event.preventDefault();
    const dataset = event.target.dataset;

    if (dataset.special) {
      const roll = new Roll(
        `1d100cs<=(@${dataset.special}*10)`,
        this.actor.data.data.specials
      );
      roll.roll().toMessage({
        flavor: this.getSpecialRollFlavor(dataset.special),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
    }
  }

  /**
   * Roll a Skill for the Actor.
   */
  protected rollSkill(event: RollEvent): void {
    event.preventDefault();
    const dataset = event.target.dataset;

    if (dataset.skill) {
      const roll = new Roll(
        `1d100cs<=@${dataset.skill}.total`,
        this.actor.data.data.skills
      );
      roll.roll().toMessage({
        flavor: this.getSkillRollFlavor(dataset.skill),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
    }
  }

  /**
   * Get an internationalized SPECIAL roll flavor text.
   * @param name - the name of the SPECIAL
   * @returns the internationalized flavor text
   */
  private getSpecialRollFlavor(name: string): string {
    const i18n = getGame().i18n;
    const i18nName = isSpecialName(name)
      ? WvI18n.specials[name].long
      : i18n.localize("wv.labels.errors.unknownSpecial");
    return i18n.format("wv.labels.rolls.genericFlavor", { what: i18nName });
  }

  /**
   * Get an internationalized Skill roll flavor text.
   * @param name - the name of the Skill
   * @returns the internationalized flavor text
   */
  private getSkillRollFlavor(name: string): string {
    const i18n = getGame().i18n;
    const i18nName = isSkillName(name)
      ? WvI18n.skills[name]
      : i18n.localize("wv.labels.errors.unknownSkill");
    return i18n.format("wv.labels.rolls.genericFlavor", { what: i18nName });
  }
}

type RollEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;

interface SheetThaumSpecial {
  name?: string;
  selected?: boolean;
}

type SheetThaumSpecials = Partial<
  Record<ThaumaturgySpecials, SheetThaumSpecial>
>;

interface SheetMagic {
  thaumSpecials?: SheetThaumSpecials;
}

interface SheetSpecial extends I18nSpecial {
  value?: number;
}

interface SheetSkill {
  name?: string;
  ranks?: number;
  special?: string;
  total?: number;
}

interface SheetData extends ActorSheet.Data {
  sheet?: {
    magic?: SheetMagic;
    skills?: Partial<Record<SkillNames, SheetSkill>>;
    specials?: Partial<Record<SpecialNames, SheetSpecial>>;
  };
}

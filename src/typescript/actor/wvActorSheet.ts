import {
  CONSTANTS,
  SkillNames,
  SpecialNames,
  ThaumaturgySpecials
} from "../constants.js";
import WvI18n, { I18nSpecial } from "../wvI18n.js";
import WvActor from "./wvActor.js";

/** The basic Wasteland Ventures Actor Sheet. */
export default class WvActorSheet extends ActorSheet<SheetData, WvActor> {
  /** @override */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "actor-sheet"],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  /** @override */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html
      .find(".rollable[data-special]")
      .on("click", this.rollSpecial.bind(this));
    html.find(".rollable[data-skill]").on("click", this.rollSkill.bind(this));
  }

  /** @override */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getData() {
    const data = await super.getData();
    data.sheet = {};

    const specialI18ns = WvI18n.specials;
    data.sheet.specials = {};
    for (const special of SpecialNames) {
      data.sheet.specials[special] = {
        long: specialI18ns[special].long,
        short: specialI18ns[special].short,
        value: data.data.specials[special]
      };
    }

    const skillI18ns = WvI18n.skills;
    data.sheet.skills = {};
    for (const skill of SkillNames) {
      const special: SpecialNames =
        skill === "thaumaturgy"
          ? data.data.magic.thaumSpecial
          : CONSTANTS.skillSpecials[skill];
      data.sheet.skills[skill] = {
        name: skillI18ns[skill],
        ranks: data.data.leveling.skillRanks[skill],
        special: specialI18ns[special].short,
        total: data.data.skills[skill]?.total
      };
    }

    data.sheet.magic = {};
    data.sheet.magic.thaumSpecials = {};
    for (const thaumSpecial of ThaumaturgySpecials) {
      data.sheet.magic.thaumSpecials[thaumSpecial] = {
        name: specialI18ns[thaumSpecial].long,
        selected: thaumSpecial === data.data.magic.thaumSpecial
      };
    }

    return data;
  }

  protected rollSpecial(event: RollEvent): void {
    event.preventDefault();
    const dataset = event.target.dataset;

    if (dataset.special) {
      const roll = new Roll(
        `1d100cs<=(@${dataset.special}*10)`,
        this.actor.data.data.specials
      );
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
    }
  }

  protected rollSkill(event: RollEvent): void {
    event.preventDefault();
    const dataset = event.target.dataset;

    if (dataset.skill) {
      const roll = new Roll(
        `1d100cs<=@${dataset.skill}.total`,
        this.actor.data.data.skills
      );
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
    }
  }
}

type RollEvent = JQuery.ClickEvent<HTMLElement, any, HTMLElement, HTMLElement>;

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

interface SheetData extends ActorSheet.Data<WvActor> {
  sheet?: {
    magic?: SheetMagic;
    skills?: Partial<Record<SkillNames, SheetSkill>>;
    specials?: Partial<Record<SpecialNames, SheetSpecial>>;
  };
}

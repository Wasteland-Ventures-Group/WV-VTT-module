import { CONSTANTS, SkillNames, SpecialNames } from "../constants.js";
import { Skill } from "../data/actorData.js";
import WvI18n, { I18nSpecial } from "../wvI18n.js";
import WvActor from "./wvActor.js";

type RollEvent = JQuery.ClickEvent<HTMLElement, any, HTMLElement, HTMLElement>;

interface SheetSpecial extends I18nSpecial {
  value?: number;
}

interface SheetSkill {
  total?: number;
  ranks?: number;
  name?: string;
}

interface SheetData extends ActorSheet.Data<WvActor> {
  sheet?: {
    specials?: Partial<Record<SpecialNames, SheetSpecial>>;
    skills?: Partial<Record<SkillNames, SheetSkill>>;
  };
}

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
    let special: keyof typeof data.data.specials;
    for (special in data.data.specials) {
      data.sheet.specials[special] = {
        long: specialI18ns[special].long,
        short: specialI18ns[special].short,
        value: data.data.specials[special]
      };
    }

    const skillI18ns = WvI18n.skills;
    data.sheet.skills = {};
    let skill: keyof typeof data.data.skills;
    for (skill in data.data.skills) {
      data.sheet.skills[skill] = {
        total: data.data.skills[skill]?.total,
        ranks: data.data.leveling.skillRanks[skill],
        name: skillI18ns[skill]
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

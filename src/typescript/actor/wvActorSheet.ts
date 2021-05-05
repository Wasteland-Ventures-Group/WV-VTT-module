import { SkillNames, SpecialNames } from "../constants.js";
import { CONSTANTS } from "../constants.js";
import WvLocalization, { Special as I18nSpecial } from "../wvLocalization.js";
import WvActor from "./wvActor.js";

type RollEvent = JQuery.ClickEvent<HTMLElement, any, HTMLElement, HTMLElement>;

interface Special extends I18nSpecial {
  value?: number;
}

interface Skill {
  name?: string;
  value?: number;
}

type Specials = Partial<Record<SpecialNames, Special>>;
type Skills = Partial<Record<SkillNames, Skill>>;

interface SheetData extends ActorSheet.Data<WvActor> {
  sheet?: {
    specials?: Specials;
    skills?: Skills;
  };
}

/**
 * The basic Wasteland Ventures Actor Sheet.
 */
export default class WvActorSheet extends ActorSheet<SheetData, WvActor> {
  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wasteland-ventures", "actor-sheet"],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
      ],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html
      .find(".rollable[data-special]")
      .on("click", this.rollSpecial.bind(this));
    html.find(".rollable[data-skill]").on("click", this.rollSkill.bind(this));
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getData() {
    const data = await super.getData();
    data.sheet = {};

    const specialsI18n = WvLocalization.specials;
    data.sheet.specials = {};
    let special: keyof typeof data.data.specials;
    for (special in data.data.specials) {
      data.sheet.specials[special] = {
        long: specialsI18n[special].long,
        short: specialsI18n[special].short,
        value: data.data.specials[special]
      };
    }

    const skillsI18n = WvLocalization.skills;
    data.sheet.skills = {};
    let skill: keyof typeof data.data.skills;
    for (skill in data.data.skills) {
      data.sheet.skills[skill] = {
        name: skillsI18n[skill],
        value: data.data.skills[skill]
      };
    }

    return data;
  }

  protected rollSpecial(event: RollEvent): void {
    event.preventDefault();
    const dataset = event.target.dataset;

    if (dataset.special) {
      const roll = new Roll(
        `1d100cs>(@${dataset.special}*10)`,
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
        `1d100cs>@${dataset.skill}`,
        this.actor.data.data.skills
      );
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });
    }
  }
}

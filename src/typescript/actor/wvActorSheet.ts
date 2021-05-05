import { SkillNames, SpecialNames } from "../constants.js";
import { CONSTANTS } from "../constants.js";
import WvLocalization, { Special as I18nSpecial } from "../wvLocalization.js";
import WvActor from "./wvActor.js";

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
export default class WvActorSheet extends ActorSheet<SheetData> {
  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wasteland-ventures", "actor-sheet"],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
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
}

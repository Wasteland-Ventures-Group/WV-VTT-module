import { SkillNames, SpecialNames } from "./constants";
import { getGame } from "./foundryHelpers.js";
import { isSkillName, isSpecialName } from "./helpers.js";

/** The internationalization structure of a single SPECIAL. */
export interface I18nSpecial {
  /** The long name of the SPECIAL stat. */
  long: string;

  /** The short name of the SPECIAL stat. */
  short: string;
}

/** The internationalization structure of the SPECIALs. */
export type I18nSpecials = Record<SpecialNames, I18nSpecial>;

/** The internationalization structure of the SPECIALs. */
export type I18nSkills = Record<SkillNames, string>;

/**
 * A helper class to serve Wasteland Ventures internationalization structures.
 */
export default class WvI18n {
  /** Get the internationalization of the SPECIALs. */
  static get specials(): I18nSpecials {
    return getGame().i18n.localize("wv.specials") as unknown as I18nSpecials;
  }

  /** Get the internationalization of the skills. */
  static get skills(): I18nSkills {
    return getGame().i18n.localize("wv.skills") as unknown as I18nSkills;
  }

  /**
   * Get an internationalized SPECIAL roll flavor text.
   * @param name - the name of the SPECIAL
   * @returns the internationalized flavor text
   */
  static getSpecialRollFlavor(name: string): string {
    const i18n = getGame().i18n;
    const i18nName = isSpecialName(name)
      ? this.specials[name].long
      : i18n.localize("wv.labels.errors.unknownSpecial");
    return i18n.format("wv.labels.rolls.genericFlavor", { what: i18nName });
  }

  /**
   * Get an internationalized Skill roll flavor text.
   * @param name - the name of the Skill
   * @returns the internationalized flavor text
   */
  static getSkillRollFlavor(name: string): string {
    const i18n = getGame().i18n;
    const i18nName = isSkillName(name)
      ? this.skills[name]
      : i18n.localize("wv.labels.errors.unknownSkill");
    return i18n.format("wv.labels.rolls.genericFlavor", { what: i18nName });
  }
}

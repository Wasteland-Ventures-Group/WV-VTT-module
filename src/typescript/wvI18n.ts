import { SkillNames, SpecialNames } from "./constants";

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
    return (game.i18n.localize("wv.specials") as unknown) as I18nSpecials;
  }

  /** Get the internationalization of the skills. */
  static get skills(): I18nSkills {
    return (game.i18n.localize("wv.skills") as unknown) as I18nSkills;
  }
}

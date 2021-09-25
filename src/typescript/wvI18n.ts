import type { SkillName, SpecialName } from "./constants";

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
export type I18nSpecials = Record<SpecialName, I18nSpecial>;

/** The internationalization structure of the SPECIALs. */
export type I18nSkills = Record<SkillName, string>;

/**
 * A helper class to serve Wasteland Ventures internationalization structures.
 */
export default class WvI18n {
  /** Get the internationalization of the SPECIALs. */
  static get specials(): I18nSpecials {
    return getGame().i18n.localize(
      "wv.specials.names"
    ) as unknown as I18nSpecials;
  }

  /** Get the internationalization of the skills. */
  static get skills(): I18nSkills {
    return getGame().i18n.localize("wv.skills.names") as unknown as I18nSkills;
  }

  /**
   * Get an internationalized SPECIAL roll flavor text.
   * @param name - the name of the SPECIAL
   * @returns the internationalized flavor text
   */
  static getSpecialRollFlavor(name: string): string {
    return getGame().i18n.format("wv.rolls.flavor", {
      what: this.getSpecialLongName(name)
    });
  }

  /**
   * Get an internationalized SPECIAL roll modifier description.
   * @param name - the name of the SPECIAL
   * @returns the internationalized description
   */
  static getSpecialModifierDescription(name: string): string {
    return getGame().i18n.format("wv.prompt.descriptions.modifier", {
      what: this.getSpecialLongName(name)
    });
  }

  /**
   * Get an internationalized Skill roll flavor text.
   * @param name - the name of the Skill
   * @returns the internationalized flavor text
   */
  static getSkillRollFlavor(name: string): string {
    return getGame().i18n.format("wv.rolls.flavor", {
      what: this.getSkillName(name)
    });
  }

  /**
   * Get an internationalized Skill roll modifier description.
   * @param name - the name of the Skill
   * @returns the internationalized description
   */
  static getSkillModifierDescription(name: string): string {
    return getGame().i18n.format("wv.prompt.descriptions.modifier", {
      what: this.getSkillName(name)
    });
  }

  /**
   * Get the long, internationalized name of a given SPECIAL name.
   * @param name - the name of the SPECIAL
   * @returns the internationalized, long SPECIAL name.
   */
  private static getSpecialLongName(name: string): string {
    return isSpecialName(name)
      ? this.specials[name].long
      : getGame().i18n.localize("wv.specials.errors.unknownSpecial");
  }

  /**
   * Get the internationalized name of a given Skill name.
   * @param name - the name of the Skill
   * @returns the internationalized Skill name.
   */
  private static getSkillName(name: string): string {
    return isSkillName(name)
      ? this.skills[name]
      : getGame().i18n.localize("wv.skills.errors.unknownSkill");
  }
}

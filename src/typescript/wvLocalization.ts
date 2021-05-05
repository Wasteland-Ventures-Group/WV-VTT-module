import { SkillNames, SpecialNames } from "./constants";

/** The localization structure of a single SPECIAL. */
export interface Special {
  /** The long name of the SPECIAL stat. */
  long: string;

  /** The short name of the SPECIAL stat. */
  short: string;
}

/** The localization structure of the SPECIALs. */
export type Specials = Record<SpecialNames, Special>;

/** A helper class to serve Wasteland Ventures localization structures. */
export default class WvLocalization {
  /** Get the localization of the SPECIALs. */
  static get specials(): Specials {
    return (game.i18n.localize("wv.specials") as unknown) as Specials;
  }

  /** Get the localization of the skills. */
  static get skills(): Record<SkillNames, string> {
    return (game.i18n.localize("wv.skills") as unknown) as Record<
      SkillNames,
      string
    >;
  }
}

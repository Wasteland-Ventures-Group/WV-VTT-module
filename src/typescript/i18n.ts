/** The localization structure of a single SPECIAL. */
export interface Special {
  /** The long name of the SPECIAL stat. */
  long: string;

  /** The short name of the SPECIAL stat. */
  short: string;
}

/** The localization structure of the SPECIALs. */
export interface Specials {
  strength: Special;
  perception: Special;
  endurance: Special;
  charisma: Special;
  intelligence: Special;
  agility: Special;
  luck: Special;
}

/** A helper class to serve Wasteland Ventures localization structures. */
export default class WvLocalization {
  /** Get the localization of the SPECIALs. */
  static get specials(): Specials {
    return (game.i18n.localize("wv.specials") as unknown) as Specials;
  }
}

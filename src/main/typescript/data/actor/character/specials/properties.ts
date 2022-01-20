import type { SpecialName } from "../../../../constants.js";

/** Derived SPECIALs related data */
export default class Specials implements Partial<Record<SpecialName, Special>> {
  /** The Strength SPECIAL value of an Actor */
  strength?: Special;

  /** The Perception SPECIAL value of an Actor */
  perception?: Special;

  /** The Endurance SPECIAL value of an Actor */
  endurance?: Special;

  /** The Charisma SPECIAL value of an Actor */
  charisma?: Special;

  /** The Intelligence SPECIAL value of an Actor */
  intelligence?: Special;

  /** The Agility SPECIAL value of an Actor */
  agility?: Special;

  /** The Luck SPECIAL value of an Actor */
  luck?: Special;
}

/** A SPECIAL, holding all intermediary steps for the final result */
export class Special {
  /**
   * Create a new SPECIAL.
   * @param base - the base value of the SPECIAL, from invested points only
   * @param permTotal - the permanent total of the SPECIAL
   * @param tempTotal - the temporary total of the SPECIAL
   */
  constructor(base = 0, permTotal = 0, tempTotal = 0) {
    this.base = base;
    this.permTotal = permTotal;
    this.tempTotal = tempTotal;
  }

  /** The base value of the SPECIAL, from invested points only */
  base: number;

  /** The permanent SPECIAL total */
  permTotal: number;

  /** The temporary SPECIAL total */
  tempTotal: number;
}

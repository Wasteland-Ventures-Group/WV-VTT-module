import type { SpecialName } from "../../../../constants.js";

export default class SpecialsProperties
  implements Record<SpecialName, Special>
{
  /** The Strength SPECIAL of the character */
  strength = new Special();

  /** The Perception SPECIAL of the character */
  perception = new Special();

  /** The Endurance SPECIAL of the character */
  endurance = new Special();

  /** The Charisma SPECIAL of the character */
  charisma = new Special();

  /** The Intelligence SPECIAL of the character */
  intelligence = new Special();

  /** The Agility SPECIAL of the character */
  agility = new Special();

  /** The Luck SPECIAL of the character */
  luck = new Special();
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

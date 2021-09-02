/** An interface that represents attack values of a weapon. */
export default interface Attack {
  /** A name for the attack */
  name: string;

  /** Notes or a description of the attack */
  description: string;

  /** The values related to the damage the weapon causes */
  damage: {
    /** The base damage amount */
    base: number;

    /** The number of d6 to throw for variable damage */
    dice: number;

    /** Whether the die property is the minimum value of a die range */
    diceRange: boolean;
  };

  /** The amount of rounds used with the attack */
  rounds: number;

  /** The damage threshold reduction of the attack */
  dtReduction: number;

  /** The splash radius */
  splash: unknown; // TODO: implement an enum or similar

  /** The amount of action points needed to attack */
  ap: number;
}

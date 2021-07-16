/**
 * A factory class to create string formulas for Rolls.
 */
export default class Formulator {
  /**
   * Create a Formulator for a SPECIAL roll.
   * @param target - the target number for the SPECIAL roll (1 - 100)
   * @returns a new Formulator
   */
  static special(target: number): Formulator {
    return new Formulator(target, true);
  }

  /**
   * Create a Formulator for a Skill roll.
   * @param target - the target number for the Skill roll
   * @returns a new Formulator
   */
  static skill(target: number): Formulator {
    return new Formulator(target);
  }

  /**
   * Construct a new Formulator.
   * @param target - the target number (1 - 100)
   * @param special - whether the roll is for a SPECIAL
   */
  private constructor(target: number, special = false) {
    this.target = target;
    this.special = special;
  }

  /**
   * The base target value for the roll
   */
  private target: number;

  /**
   * Whether the roll is for a SPECIAL
   */
  private special: boolean;

  /**
   * An optional modifier to the roll
   */
  private modifier?: number;

  /**
   * Modify the target number of the roll.
   * @param modifier - the modifier to modify by
   * @returns the modified Formulator
   */
  modify(modifier?: number): this {
    this.modifier = modifier;
    return this;
  }

  /**
   * Get a formula representation of this Formulator.
   * @returns the formula
   */
  toString(): string {
    const prefix = "1d100cs<=";
    if (!this.special && !this.modifier) {
      return prefix + this.target;
    }

    let targetFormula = "(" + this.target + (this.special ? " * 10" : "");
    if (this.modifier) {
      targetFormula +=
        (this.modifier >= 0 ? " + " : " - ") + Math.abs(this.modifier);
    }
    return prefix + targetFormula + ")";
  }
}

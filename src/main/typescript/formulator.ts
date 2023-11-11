import { CONSTANTS, RollMode } from "./constants.js";
import { LOG } from "./systemLogger.js";

/** A factory class to create string formulas for Rolls. */
export default class Formulator {
  /**
   * Create a Formulator for a SPECIAL roll.
   * @param target - the success target number for the SPECIAL roll (1 - 100)
   * @returns a new Formulator
   */
  static special(target: number): Formulator {
    return new Formulator("check", { target, subType: "special" });
  }

  /**
   * Create a Formulator for a Skill roll.
   * @param target - the success target number for the Skill roll (1 - 100)
   * @returns a new Formulator
   */
  static skill(target: number): Formulator {
    return new Formulator("check", { target, subType: "skill" });
  }

  /**
   * Create a Formulator for a resistance roll
   * @param target the target percentile for the resistance check
   * @param count the number of dice to roll for the check
   * @returns a new Formulator
   */
  static resistance(target: number, count: number): Formulator {
    return new Formulator("check", { target, subType: "resistance", count });
  }

  /**
   * Create a Formulator for a damage roll.
   * @param base - the base damage for the the roll
   * @param count - the amout of damage die for the roll
   * @returns a new Formulator
   */
  static damage(base: number, count: number): Formulator {
    return new Formulator("damage", { base, count });
  }

  /**
   * Construct a new Formulator.
   * @param type - the type of roll
   */
  private constructor(
    type: RollType,
    {
      base,
      count,
      target,
      subType
    }: {
      /** the base damage for a damage roll */
      base?: number;

      /** the amount of damage die for a damage roll */
      count?: number;

      /**
       * the success target number (1 - 100), required for checks, ignored for
       * damage
       */
      target?: number;

      /** whether the roll is for a SPECIAL, ignored for damage */
      subType?: "special" | "skill" | "resistance";
    }
  ) {
    this.type = type;

    if (this.type === "check") {
      if (typeof target !== "number")
        throw new Error("A target is required for checks.");

      this.target = target;
      this.subType = subType ?? "skill";
      this.count = count ?? 1;
    } else {
      this.base = base ?? 0;
      this.count = count ?? 1;
      this.target = CONSTANTS.rules.damage.dieTarget;
      this.subType = "skill";
    }
  }

  /** The type of the roll. */
  private type: RollType;

  /** The base success target value for the roll */
  private target: number;

  /** The base damage for damage roll */
  private base?: number;

  /** The amount of die to roll. (1 for skill and SPECIAL checks) */
  private count: number;

  /** Whether the roll is for a SPECIAL, skill, or a resistance */
  private subType: "skill" | "special" | "resistance";

  /** An optional modifier to the roll */
  private modifier?: number | undefined;

  /** The critical success chance of the roll. */
  private criticalSuccess?: number | undefined;

  /** The critical failure chance of the roll. */
  private criticalFailure?: number | undefined;

  /**
   * Add critical flagging modifiers to the roll.
   * @returns the changed Formulator
   */
  criticals({
    success,
    failure
  }: {
    /** the success chance (inclusive) */
    success: number;

    /** the failure chance (inclusive) */
    failure: number;
  }): this {
    if (this.type !== "check")
      LOG.warn("Criticals only apply to checks! Ignoring this.");
    this.criticalFailure = failure;
    this.criticalSuccess = success;
    return this;
  }

  /**
   * Modify the target number of the roll.
   * @param modifier - the modifier to modify by
   * @returns the modified Formulator
   */
  modify(modifier?: number): this {
    if (this.type !== "check")
      LOG.warn("Modifiers only apply to checks! Ignoring this.");
    this.modifier = modifier;
    return this;
  }

  /**
   * Get a formula representation of this Formulator.
   * @returns the formula
   */
  toString(): string {
    let formula = this.baseDieFormula;

    if (this.type === "damage") {
      formula += this.damageTargetFormula;
    } else if (this.type === "check") {
      formula +=
        this.checkSuccessTargetFormula + this.checkCriticalsTargetFormula;
    }
    console.log(formula);

    return formula;
  }

  /** Get the d100 target for a check roll. */
  get d100Target(): number {
    return this.special ? this.target * 10 : this.target;
  }

  /** Get whether or not this roll is a SPECIAL roll */
  get special(): boolean {
    return this.subType === "special";
  }

  /** Get whether or not this roll is a resistance check */
  get resist(): boolean {
    return this.subType === "resistance";
  }

  /** Get the base dice formula for the roll. */
  protected get baseDieFormula(): string {
    if (this.type === "check") return `${this.count}d100`;
    else return `${this.base} + ${this.count}d6`;
  }

  /** Get the success target formula a check roll. */
  protected get checkSuccessTargetFormula(): string {
    const baseTarget = this.target * (this.special ? 10 : 1);

    let targetFormula = "cs";

    if (this.resist) targetFormula += ">";
    else targetFormula += "<=";

    if (this.modifier || this.special) targetFormula += "(";

    targetFormula += `${this.d100Target}`;

    if (this.modifier) {
      if (this.modifier < 0) {
        targetFormula += " - " + Math.min(baseTarget, Math.abs(this.modifier));
      } else {
        targetFormula += " + " + this.modifier;
      }
    }

    if (this.modifier || this.special) targetFormula += ")";

    return targetFormula;
  }

  /** Get the critical modifiers for a check roll. */
  protected get checkCriticalsTargetFormula(): string {
    let formula = "";

    if (typeof this.criticalSuccess === "number") {
      formula += `fcs${this.criticalSuccess}`;
    }

    if (typeof this.criticalFailure === "number") {
      formula += `fcf${this.criticalFailure}`;
    }

    return formula;
  }

  /** Get the target formula for a damage roll. */
  protected get damageTargetFormula(): string {
    return `cs>=${this.target}`;
  }
}

type RollType = "check" | "damage";

/** Options for modifying rolls. */
export interface RollOptions {
  /**
   * An ad-hoc modifier to roll with. When undefined, no modifier is applied.
   * @defaultValue `undefined`
   */
  modifier?: number;

  rollMode?: RollMode;
}

import type { SkillName } from "../../../../constants.js";

/** Derived skill values */
export default class Skills implements Partial<Record<SkillName, Skill>> {
  /** The barter skill value of an Actor */
  barter?: Skill;

  /** The diplomacy skill value of an Actor */
  diplomacy?: Skill;

  /** The explosives skill value of an Actor */
  explosives?: Skill;

  /** The firearms skill value of an Actor */
  firearms?: Skill;

  /** The intimidation skill value of an Actor */
  intimidation?: Skill;

  /** The lockpick skill value of an Actor */
  lockpick?: Skill;

  /** The magical energy weapons skill value of an Actor */
  magicalEnergyWeapons?: Skill;

  /** The mechanics skill value of an Actor */
  mechanics?: Skill;

  /** The medicine skill value of an Actor */
  medicine?: Skill;

  /** The melee skill value of an Actor */
  melee?: Skill;

  /** The science skill value of an Actor */
  science?: Skill;

  /** The sleight skill value of an Actor */
  sleight?: Skill;

  /** The sneak skill value of an Actor */
  sneak?: Skill;

  /** The survival skill value of an Actor */
  survival?: Skill;

  /** The thaumaturgy skill value of an Actor */
  thaumaturgy?: Skill;

  /** The unarmed skill value of an Actor */
  unarmed?: Skill;
}

/** A skill, holding all intermediary steps for the final result */
export class Skill {
  /**
   * Create a new Skill.
   * @param base - the base value of the skill, derived from SPECIAL
   * @param total - the total value of the skill, base plus skill points
   */
  constructor(base = 0, total = 0) {
    this.base = base;
    this.total = total;
  }

  /** The base value of the skill, from SPECIAL only */
  base: number;

  /** The final value of the skill with all modifiers applied */
  total: number;
}

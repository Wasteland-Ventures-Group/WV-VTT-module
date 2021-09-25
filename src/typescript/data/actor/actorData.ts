import type { SkillName, TYPES } from "../../constants.js";
import {
  Leveling as DbLeveling,
  Specials as DbSpecials,
  Vitals as DbVitals,
  PlayerCharacterDataSourceData
} from "./actorDbData.js";

/** Derived SPECIALs related data */
export class Specials extends DbSpecials {}

/** Derived skill values */
export class Skills implements Partial<Record<SkillName, Skill>> {
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
  constructor(base: number, total: number) {
    this.base = base;
    this.total = total;
  }

  /** The base value of the skill, from SPECIAL only */
  base?: number;

  /** The final value of the skill with all modifiers applied */
  total?: number;
}

/** Derived vitals data */
export class Vitals extends DbVitals {
  /** The healing rate of an Actor per 8 hours of rest */
  healingRate?: number;
}

/** Derived leveling related data */
export class Leveling extends DbLeveling {
  /** The current level of an Actor */
  level?: number;

  /** The maximum skill points of an Actor */
  maxSkillPoints?: number;
}

/** Derived resistance values */
export class Resistances {
  /** The basic poison resitance of an Actor */
  poison = 10;

  /** The basic radiation resistance of an Actor */
  radiation = 5;
}

/** Derived secondary statistics */
export class SecondaryStatistics {
  /** The maximum carry weight of an Actor in kg */
  maxCarryWeight?: number;
}

/** The player character data-properties data */
export class PlayerCharacterDataPropertiesData extends PlayerCharacterDataSourceData {
  override specials: Specials = new Specials();

  /** The skills of an Actor */
  skills: Skills = new Skills();

  override vitals: Vitals = new Vitals();

  override leveling: Leveling = new Leveling();

  /** The resistances of an Actor */
  resistances?: Resistances = new Resistances();

  /** The secondary statistics of an Actor */
  secondary?: SecondaryStatistics = new SecondaryStatistics();
}

/** The player character data-properties */
export interface PlayerCharacterDataProperties {
  type: typeof TYPES.ACTOR.PLAYER_CHARACTER;
  data: PlayerCharacterDataPropertiesData;
}

/** A union for the data properties of all Actor types */
export type WvActorDataProperties = PlayerCharacterDataProperties;

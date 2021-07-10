import { SkillNames, TYPES } from "../constants.js";
import {
  Background,
  Leveling as DbLeveling,
  Magic,
  Specials as DbSpecials,
  Vitals as DbVitals,
  PlayerCharacterDataSourceData
} from "./actorDbData.js";

/** Derived SPECIALs related data */
export class Specials extends DbSpecials {}

/** Derived skill values */
export class Skills implements Partial<Record<SkillNames, Skill>> {
  constructor(
    /** The barter skill value of an Actor */
    public barter?: Skill,

    /** The diplomacy skill value of an Actor */
    public diplomacy?: Skill,

    /** The explosives skill value of an Actor */
    public explosives?: Skill,

    /** The firearms skill value of an Actor */
    public firearms?: Skill,

    /** The intimidation skill value of an Actor */
    public intimidation?: Skill,

    /** The lockpick skill value of an Actor */
    public lockpick?: Skill,

    /** The magical energy weapons skill value of an Actor */
    public magicalEnergyWeapons?: Skill,

    /** The mechanics skill value of an Actor */
    public mechanics?: Skill,

    /** The medicine skill value of an Actor */
    public medicine?: Skill,

    /** The melee skill value of an Actor */
    public melee?: Skill,

    /** The science skill value of an Actor */
    public science?: Skill,

    /** The sleight skill value of an Actor */
    public sleight?: Skill,

    /** The sneak skill value of an Actor */
    public sneak?: Skill,

    /** The survival skill value of an Actor */
    public survival?: Skill,

    /** The thaumaturgy skill value of an Actor */
    public thaumaturgy?: Skill,

    /** The unarmed skill value of an Actor */
    public unarmed?: Skill
  ) {}
}

/** A skill, holding all intermediary steps for the final result */
export class Skill {
  constructor(
    /** The base value of the skill, from SPECIAL only */
    public base?: number,

    /** The final value of the skill with all modifiers applied */
    public total?: number
  ) {}
}

/** Derived vitals data */
export class Vitals extends DbVitals {
  constructor(
    /** The healing rate of an Actor per 8 hours of rest */
    public healingRate?: number
  ) {
    super();
  }
}

/** Derived leveling related data */
export class Leveling extends DbLeveling {
  constructor(
    /** The current level of an Actor */
    public level?: number,

    /** The maximum skill points of an Actor */
    public maxSkillPoints?: number
  ) {
    super();
  }
}

/** Derived resistance values */
export class Resistances {
  constructor(
    /** The basic poison resitance of an Actor */
    public poison: number = 10,

    /** The basic radiation resistance of an Actor */
    public radiation: number = 5
  ) {}
}

/** Derived secondary statistics */
export class SecondaryStatistics {
  constructor(
    /** The maximum carry weight of an Actor in kg */
    public maxCarryWeight?: number
  ) {}
}

/** The player character data-properties data */
export class PlayerCharacterDataPropertiesData extends PlayerCharacterDataSourceData {
  constructor(
    /** The SPECIALs of an Actor */
    public specials: Specials = new Specials(),

    /** The skills of an Actor */
    public skills: Skills = new Skills(),

    /** The vitals of an Actor */
    public vitals: Vitals = new Vitals(),

    /** The leveling stats of an Actor */
    public leveling: Leveling = new Leveling(),

    /** The background of an Actor */
    public background: Background = new Background(),

    /** The resistances of an Actor */
    public resistances: Resistances | undefined = new Resistances(),

    /** The secondary statistics of an Actor */
    public secondary:
      | SecondaryStatistics
      | undefined = new SecondaryStatistics()
  ) {
    super(specials, vitals, leveling, new Magic(), background);
  }
}

/** The player character data-properties */
export interface PlayerCharacterDataProperties {
  type: typeof TYPES.ACTOR.PLAYER_CHARACTER;
  data: PlayerCharacterDataPropertiesData;
}

/** A union for the data properties of all Actor types */
export type WvActorDataProperties = PlayerCharacterDataProperties;

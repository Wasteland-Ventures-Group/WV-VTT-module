import type { TemplateDocumentType } from "../common.js";

import {
  SkillNames,
  SpecialNames,
  ThaumaturgySpecials,
  TYPES
} from "../../constants.js";
import { Resource as FoundryResource } from "../foundryCommon.js";

/** An Actor SPECIALs object for the database */
export class Specials implements Record<SpecialNames, number> {
  constructor(
    /** The current base Strength of an Actor */
    public strength: number = 5,

    /** The current base Perception of an Actor */
    public perception: number = 5,

    /** The current base Endurance of an Actor */
    public endurance: number = 5,

    /** The current base Charisma of an Actor */
    public charisma: number = 5,

    /** The current base Intelligence of an Actor */
    public intelligence: number = 5,

    /** The current base Agility of an Actor */
    public agility: number = 5,

    /** The current base Luck of an Actor */
    public luck: number = 5
  ) {}
}

/** An Actor vitals object for the database */
export class Vitals {
  constructor(
    /** The current amount of hit points of an Actor */
    public hitPoints: FoundryResource = new FoundryResource(10),

    /** The current amount of action points of an Actor */
    public actionPoints: FoundryResource = new FoundryResource(10),

    /** The current insanity of an Actor */
    public insanity: FoundryResource = new FoundryResource(0),

    /** The current strain of an Actor */
    public strain: FoundryResource = new FoundryResource(20)
  ) {}
}

/** An Actor leveling object for the database */
export class Leveling {
  constructor(
    /** The current experience of an Actor */
    public experience: number = 0,

    /**
     * The skill point relevant intelligence values at each level up of an Actor
     */
    public levelIntelligences: number[] = [],

    /** The skill ranks added for an Actor */
    public skillRanks: SkillRanks = new SkillRanks()
  ) {}
}

/** An Actor invested skill points object for the database */
export class SkillRanks implements Record<SkillNames, number> {
  constructor(
    /** The invested Barter skill points of an Actor */
    public barter: number = 0,

    /** The invested Diplomacy skill points of an Actor */
    public diplomacy: number = 0,

    /** The invested Explosives skill points of an Actor */
    public explosives: number = 0,

    /** The invested Firearms skill points of an Actor */
    public firearms: number = 0,

    /** The invested Intimidation skill points of an Actor */
    public intimidation: number = 0,

    /** The invested Lockpick skill points of an Actor */
    public lockpick: number = 0,

    /** The invested Magical Energy Weapons skill points of an Actor */
    public magicalEnergyWeapons: number = 0,

    /** The invested Mechanics skill points of an Actor */
    public mechanics: number = 0,

    /** The invested Medicine skill points of an Actor */
    public medicine: number = 0,

    /** The invested Melee skill points of an Actor */
    public melee: number = 0,

    /** The invested Science skill points of an Actor */
    public science: number = 0,

    /** The invested Sleight skill points of an Actor */
    public sleight: number = 0,

    /** The invested Sneak skill points of an Actor */
    public sneak: number = 0,

    /** The invested Survival skill points of an Actor */
    public survival: number = 0,

    /** The invested Thaumaturgy skill points of an Actor */
    public thaumaturgy: number = 0,

    /** The invested Unarmed skill points of an Actor */
    public unarmed: number = 0
  ) {}
}

/** An Actor background object for the database */
export class Background {
  constructor(
    /** The background of an Actor */
    public background: string = "",

    /** The history of an Actor */
    public history: string = "",

    /** The fears of an Actor */
    public fears: string = "",

    /** The dreams of an Actor */
    public dreams: string = "",

    /** The current karma of an Actor */
    public karma: number = 0,

    /** The current size of an Actor */
    public size: number = 0
  ) {}
}

/** An Actor magic object for the database */
export class Magic {
  constructor(
    /** The SPECIAL associated with the Thaumaturgy skill */
    public thaumSpecial: ThaumaturgySpecials = "intelligence"
  ) {}
}

/** The player character data-source data */
export class PlayerCharacterDataSourceData implements TemplateDocumentType {
  constructor(
    /** The SPECIALs of an Actor */
    public specials: Specials = new Specials(),

    /** The vitals of an Actor */
    public vitals: Vitals = new Vitals(),

    /** The leveling stats of an Actor */
    public leveling: Leveling = new Leveling(),

    /** The magic stats of an Actor */
    public magic: Magic = new Magic(),

    /** The background of an Actor */
    public background: Background = new Background()
  ) {}

  /** @override */
  getTypeName(): string {
    return TYPES.ACTOR.PLAYER_CHARACTER;
  }
}

/** The player character data-source */
export interface PlayerCharacterDataSource {
  type: typeof TYPES.ACTOR.PLAYER_CHARACTER;
  data: PlayerCharacterDataSourceData;
}

/** A union for data-sources of all Actor types */
export type WvActorDataSource = PlayerCharacterDataSource;

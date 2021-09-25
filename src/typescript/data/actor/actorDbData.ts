import type { TemplateDocumentType } from "../common.js";
import {
  SkillName,
  SpecialName,
  ThaumaturgySpecials,
  TYPES
} from "../../constants.js";
import { Resource as FoundryResource } from "../foundryCommon.js";

/** An Actor SPECIALs object for the database */
export class Specials implements Record<SpecialName, number> {
  /** The current base Strength of an Actor */
  strength = 5;

  /** The current base Perception of an Actor */
  perception = 5;

  /** The current base Endurance of an Actor */
  endurance = 5;

  /** The current base Charisma of an Actor */
  charisma = 5;

  /** The current base Intelligence of an Actor */
  intelligence = 5;

  /** The current base Agility of an Actor */
  agility = 5;

  /** The current base Luck of an Actor */
  luck = 5;
}

/** An Actor vitals object for the database */
export class Vitals {
  /** The current amount of hit points of an Actor */
  hitPoints = new FoundryResource(10);

  /** The current amount of action points of an Actor */
  actionPoints = new FoundryResource(10);

  /** The current insanity of an Actor */
  insanity = new FoundryResource(0);

  /** The current strain of an Actor */
  strain = new FoundryResource(20);
}

/** An Actor leveling object for the database */
export class Leveling {
  /** The current experience of an Actor */
  experience = 0;

  /**
   * The skill point relevant intelligence values at each level up of an Actor
   */
  levelIntelligences: number[] = [];

  /** The skill ranks added for an Actor */
  skillRanks = new SkillRanks();
}

/** An Actor invested skill points object for the database */
export class SkillRanks implements Record<SkillName, number> {
  /** The invested Barter skill points of an Actor */
  barter = 0;

  /** The invested Diplomacy skill points of an Actor */
  diplomacy = 0;

  /** The invested Explosives skill points of an Actor */
  explosives = 0;

  /** The invested Firearms skill points of an Actor */
  firearms = 0;

  /** The invested Intimidation skill points of an Actor */
  intimidation = 0;

  /** The invested Lockpick skill points of an Actor */
  lockpick = 0;

  /** The invested Magical Energy Weapons skill points of an Actor */
  magicalEnergyWeapons = 0;

  /** The invested Mechanics skill points of an Actor */
  mechanics = 0;

  /** The invested Medicine skill points of an Actor */
  medicine = 0;

  /** The invested Melee skill points of an Actor */
  melee = 0;

  /** The invested Science skill points of an Actor */
  science = 0;

  /** The invested Sleight skill points of an Actor */
  sleight = 0;

  /** The invested Sneak skill points of an Actor */
  sneak = 0;

  /** The invested Survival skill points of an Actor */
  survival = 0;

  /** The invested Thaumaturgy skill points of an Actor */
  thaumaturgy = 0;

  /** The invested Unarmed skill points of an Actor */
  unarmed = 0;
}

/** An Actor background object for the database */
export class Background {
  /** The background of an Actor */
  background = "";

  /** The history of an Actor */
  history = "";

  /** The fears of an Actor */
  fears = "";

  /** The dreams of an Actor */
  dreams = "";

  /** The current karma of an Actor */
  karma = 0;

  /** The current size of an Actor */
  size = 0;
}

/** An Actor magic object for the database */
export class Magic {
  /** The SPECIAL associated with the Thaumaturgy skill */
  thaumSpecial: ThaumaturgySpecials = "intelligence";
}

/** The player character data-source data */
export class PlayerCharacterDataSourceData implements TemplateDocumentType {
  /** The SPECIALs of an Actor */
  specials = new Specials();

  /** The vitals of an Actor */
  vitals = new Vitals();

  /** The leveling stats of an Actor */
  leveling = new Leveling();

  /** The magic stats of an Actor */
  magic = new Magic();

  /** The background of an Actor */
  background = new Background();

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

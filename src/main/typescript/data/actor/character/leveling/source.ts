import type { JSONSchemaType } from "ajv";
import {
  CONSTANTS,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames
} from "../../../../constants.js";

/** An Actor invested skill points object for the database */
export class SkillRanks implements Record<SkillName, number> {
  /** The invested Barter skill points of an Actor */
  barter = CONSTANTS.bounds.skills.points.min;

  /** The invested Diplomacy skill points of an Actor */
  diplomacy = CONSTANTS.bounds.skills.points.min;

  /** The invested Explosives skill points of an Actor */
  explosives = CONSTANTS.bounds.skills.points.min;

  /** The invested Firearms skill points of an Actor */
  firearms = CONSTANTS.bounds.skills.points.min;

  /** The invested Intimidation skill points of an Actor */
  intimidation = CONSTANTS.bounds.skills.points.min;

  /** The invested Lockpick skill points of an Actor */
  lockpick = CONSTANTS.bounds.skills.points.min;

  /** The invested Magical Energy Weapons skill points of an Actor */
  magicalEnergyWeapons = CONSTANTS.bounds.skills.points.min;

  /** The invested Mechanics skill points of an Actor */
  mechanics = CONSTANTS.bounds.skills.points.min;

  /** The invested Medicine skill points of an Actor */
  medicine = CONSTANTS.bounds.skills.points.min;

  /** The invested Melee skill points of an Actor */
  melee = CONSTANTS.bounds.skills.points.min;

  /** The invested Science skill points of an Actor */
  science = CONSTANTS.bounds.skills.points.min;

  /** The invested Sleight skill points of an Actor */
  sleight = CONSTANTS.bounds.skills.points.min;

  /** The invested Sneak skill points of an Actor */
  sneak = CONSTANTS.bounds.skills.points.min;

  /** The invested Survival skill points of an Actor */
  survival = CONSTANTS.bounds.skills.points.min;

  /** The invested Thaumaturgy skill points of an Actor */
  thaumaturgy = CONSTANTS.bounds.skills.points.min;

  /** The invested Unarmed skill points of an Actor */
  unarmed = CONSTANTS.bounds.skills.points.min;
}

export const SKILL_RANKS_JSON_SCHEMA: JSONSchemaType<SkillRanks> = {
  description: "A Skill points specification",
  type: "object",
  properties: SkillNames.reduce((skills, skillName) => {
    skills[skillName] = {
      type: "integer",
      maximum: CONSTANTS.bounds.skills.points.max,
      minimum: CONSTANTS.bounds.skills.points.min
    };
    return skills;
  }, {} as Record<SkillName, NumberProperty>),
  required: SkillNames,
  additionalProperties: false,
  default: SkillNames.reduce((skills, skillName) => {
    skills[skillName] = 0;
    return skills;
  }, {} as Record<SkillName, number>)
};

/** An Actor SPECIALs object for the database */
export class SpecialsPoints implements Record<SpecialName, number> {
  /** The invested Strength SPECIAL points of an Actor */
  strength = 5;

  /** The invested Perception SPECIAL points of an Actor */
  perception = 5;

  /** The invested Endurance SPECIAL points of an Actor */
  endurance = 5;

  /** The invested Charisma SPECIAL points of an Actor */
  charisma = 5;

  /** The invested Intelligence SPECIAL points of an Actor */
  intelligence = 5;

  /** The invested Agility SPECIAL points of an Actor */
  agility = 5;

  /** The invested Luck SPECIAL points of an Actor */
  luck = 5;
}

export const SPECIALS_POINTS_JSON_SCHEMA: JSONSchemaType<SpecialsPoints> = {
  description: "A SPECIALs points specification",
  type: "object",
  properties: SpecialNames.reduce((specials, specialName) => {
    specials[specialName] = {
      type: "integer",
      maximum: CONSTANTS.bounds.special.points.max,
      minimum: CONSTANTS.bounds.special.points.min
    };
    return specials;
  }, {} as Record<SpecialName, NumberProperty>),
  required: SpecialNames,
  additionalProperties: false,
  default: SpecialNames.reduce((specials, specialName) => {
    specials[specialName] = 5;
    return specials;
  }, {} as Record<SpecialName, number>)
};

type NumberProperty = { type: "integer"; maximum: number; minimum: number };

/** An Actor leveling object for the database */
export default class LevelingSource {
  /** The current experience of an Actor */
  experience = 0;

  /**
   * The skill point relevant intelligence values at each level up of an Actor
   */
  levelIntelligences: number[] = [];

  /** The skill ranks added for an Actor */
  skillRanks = new SkillRanks();

  specialPoints = new SpecialsPoints();
}

export const LEVELING_JSON_SCHEMA: JSONSchemaType<LevelingSource> = {
  description: "A leveling specification",
  type: "object",
  properties: {
    experience: {
      description: "The experience of the character",
      type: "integer",
      maximum: CONSTANTS.bounds.experience.max,
      minimum: CONSTANTS.bounds.experience.min
    },
    levelIntelligences: {
      description: "The permanent intelligence values at level up",
      type: "array",
      items: {
        type: "integer",
        maximum: CONSTANTS.bounds.special.points.max,
        minimum: CONSTANTS.bounds.special.points.min
      },
      minItems: 0,
      maxItems: 29
    },
    skillRanks: SKILL_RANKS_JSON_SCHEMA,
    specialPoints: SPECIALS_POINTS_JSON_SCHEMA
  },
  required: ["experience", "levelIntelligences", "skillRanks", "specialPoints"],
  additionalProperties: false,
  default: {
    experience: 0,
    levelIntelligences: [],
    skillRanks: SKILL_RANKS_JSON_SCHEMA.default,
    specialPoints: SPECIALS_POINTS_JSON_SCHEMA.default
  }
};

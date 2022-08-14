import type { JSONSchemaType } from "ajv";
import {
  CONSTANTS,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames
} from "../../../../constants.js";

export class SkillRanks implements Record<SkillName, number> {
  /** The invested Barter skill points of the character */
  barter = CONSTANTS.bounds.skills.points.min;

  /** The invested Diplomacy skill points of the character */
  diplomacy = CONSTANTS.bounds.skills.points.min;

  /** The invested Explosives skill points of the character */
  explosives = CONSTANTS.bounds.skills.points.min;

  /** The invested Firearms skill points of the character */
  firearms = CONSTANTS.bounds.skills.points.min;

  /** The invested Intimidation skill points of the character */
  intimidation = CONSTANTS.bounds.skills.points.min;

  /** The invested Lockpick skill points of the character */
  lockpick = CONSTANTS.bounds.skills.points.min;

  /** The invested Magical Energy Weapons skill points of the character */
  magicalEnergyWeapons = CONSTANTS.bounds.skills.points.min;

  /** The invested Mechanics skill points of the character */
  mechanics = CONSTANTS.bounds.skills.points.min;

  /** The invested Medicine skill points of the character */
  medicine = CONSTANTS.bounds.skills.points.min;

  /** The invested Melee skill points of the character */
  melee = CONSTANTS.bounds.skills.points.min;

  /** The invested Science skill points of the character */
  science = CONSTANTS.bounds.skills.points.min;

  /** The invested Sleight skill points of the character */
  sleight = CONSTANTS.bounds.skills.points.min;

  /** The invested Sneak skill points of the character */
  sneak = CONSTANTS.bounds.skills.points.min;

  /** The invested Survival skill points of the character */
  survival = CONSTANTS.bounds.skills.points.min;

  /** The invested Thaumaturgy skill points of the character */
  thaumaturgy = CONSTANTS.bounds.skills.points.min;

  /** The invested Unarmed skill points of the character */
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

export class SpecialsPoints implements Record<SpecialName, number> {
  /** The invested Strength SPECIAL points of the character */
  strength = 5;

  /** The invested Perception SPECIAL points of the character */
  perception = 5;

  /** The invested Endurance SPECIAL points of the character */
  endurance = 5;

  /** The invested Charisma SPECIAL points of the character */
  charisma = 5;

  /** The invested Intelligence SPECIAL points of the character */
  intelligence = 5;

  /** The invested Agility SPECIAL points of the character */
  agility = 5;

  /** The invested Luck SPECIAL points of the character */
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

export default class LevelingSource {
  /** The current experience of the character */
  experience = 0;

  /**
   * The skill point relevant intelligence values at each level up of the
   * character
   */
  levelIntelligences: number[] = [];

  /** The skill ranks of the character */
  skillRanks = new SkillRanks();

  /** The SPECIAL points of the character */
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
        maximum: CONSTANTS.bounds.special.value.max,
        minimum: CONSTANTS.bounds.special.value.min
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

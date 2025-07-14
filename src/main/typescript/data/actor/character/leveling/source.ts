import {
  CONSTANTS,
  type SkillName,
  SkillNames,
  type SpecialName,
  SpecialNames
} from "../../../../constants.js";

import fields = foundry.data.fields;

const SKILL_POINT_FIELD = new fields.NumberField({
  integer: true,
  max: CONSTANTS.bounds.skills.points.max,
  min: CONSTANTS.bounds.skills.points.min,
  initial: CONSTANTS.bounds.skills.points.min,
  required: true,
  nullable: false,
})

const SKILL_RANKS_SCHEMA = SkillNames.reduce(
  (skills, skillName) => {
    skills[skillName] = SKILL_POINT_FIELD;
    return skills;
  },
  {} as Record<SkillName, typeof SKILL_POINT_FIELD>
)

const SPECIAL_POINT_FIELD = new fields.NumberField({
  integer: true,
  max: CONSTANTS.bounds.special.points.max,
  min: CONSTANTS.bounds.special.points.min,
  required: true,
  nullable: false,
  initial: 5,
})

const SPECIAL_POINTS_SCHEMA = SpecialNames.reduce(
  (specials, specialName) => {
    specials[specialName] = SPECIAL_POINT_FIELD;
    return specials;
  },
  {} as Record<SpecialName, typeof SPECIAL_POINT_FIELD>
)

export const LEVELING_SCHEMA = {
  /** The current experience of the character */
  experience: new fields.NumberField({
    required: true, nullable: false, integer: true, min: CONSTANTS.bounds.experience.min,
    max: CONSTANTS.bounds.experience.max
  }),

  /** The SPECIAL points of the character */
  specialPoints: new fields.SchemaField(SPECIAL_POINTS_SCHEMA),

  /** The skill ranks of the character */
  skillRanks: new fields.SchemaField(SKILL_RANKS_SCHEMA),

  /**
   * The skill point relevant intelligence values at each level up of the
   * character
   */
  levelIntelligences: new fields.ArrayField(new fields.NumberField({
    required: true,
    nullable: false,
    max: CONSTANTS.bounds.special.value.max,
    min: CONSTANTS.bounds.special.value.min,
    integer: true,
  }), {
    min: 0, max: 29, required: true,
    nullable: false,
    initial: []
  })
}

export type LevelingSource = fields.SchemaField.InitializedData<typeof LEVELING_SCHEMA>;

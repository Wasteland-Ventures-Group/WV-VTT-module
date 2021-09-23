export type SpecialNames = typeof SpecialNames[number];
export const SpecialNames = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
] as const;

export type ThaumaturgySpecials = Exclude<SpecialNames, "luck">;
export const ThaumaturgySpecials = SpecialNames.filter(
  (special) => special !== "luck"
) as ThaumaturgySpecials[];

export type SkillNames = typeof SkillNames[number];
export const SkillNames = [
  "barter",
  "diplomacy",
  "explosives",
  "firearms",
  "intimidation",
  "lockpick",
  "magicalEnergyWeapons",
  "mechanics",
  "medicine",
  "melee",
  "science",
  "sleight",
  "sneak",
  "survival",
  "thaumaturgy",
  "unarmed"
] as const;

/** Type names for the system's document types */
export const TYPES = {
  /** Type names for Actor types */
  ACTOR: {
    PLAYER_CHARACTER: "playerCharacter"
  },
  /** Type names for Item types */
  ITEM: {
    AERIAL_MANEUVER: "aerialManeuver",
    EFFECT: "effect",
    ITEM: "item",
    MARK: "mark",
    PAST: "past",
    PERK: "perk",
    QUIRK: "quirk",
    RANGED_WEAPON: "rangedWeapon",
    SCHEMATIC: "schematic",
    SPELL: "spell",
    TRAIT: "trait",
    WEAPON: "weapon"
  }
} as const;

/** This object holds common constants for the Wasteland Ventures system. */
export const CONSTANTS = {
  /** This holds various min/max values for stats. */
  bounds: {
    experience: {
      max: 43500,
      min: 0
    },
    /** Bounds for the Karma value */
    karma: {
      max: 100,
      min: -100
    },
    /** Bounds related to SPECIAL values. */
    special: {
      /** The bounds for points invested in a SPECIAL. */
      points: {
        max: 15,
        min: 0
      }
    },
    /** Bounds related to Skill values. */
    skills: {
      /** The bounds for points invested in a Skill. */
      points: {
        max: 85,
        min: 0
      }
    }
  },

  /** The version number where the last migration was needed */
  needsMigrationVersion: "0.2.0",

  /** This holds skills mapping to their associated SPECIALs. */
  skillSpecials: {
    barter: "charisma",
    diplomacy: "charisma",
    explosives: "perception",
    firearms: "agility",
    intimidation: "strength",
    lockpick: "perception",
    magicalEnergyWeapons: "perception",
    mechanics: "intelligence",
    medicine: "intelligence",
    melee: "strength",
    science: "intelligence",
    sleight: "agility",
    sneak: "agility",
    survival: "endurance",
    unarmed: "endurance"
  } as Record<SkillNames, SpecialNames>,

  /** The ID of the system */
  systemId: "wasteland-ventures",

  /** The name of the system */
  systemName: "Wasteland Ventures",

  /**
   * This is the path for the system directory in Foundry's global working
   * directory.
   */
  systemPath: "systems/wasteland-ventures"
} as const;

export const HANDLEBARS = {
  partPaths: {
    item: {
      header: `${CONSTANTS.systemPath}/handlebars/items/parts/header.hbs`,
      rules: `${CONSTANTS.systemPath}/handlebars/items/parts/ruleElements.hbs`
    }
  }
};

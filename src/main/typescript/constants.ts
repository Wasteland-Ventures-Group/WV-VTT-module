export type Race = typeof Races[number];
export const Races = [
  "earthPony",
  "pegasus",
  "unicorn",
  "griffon",
  "zebra",
  "abyssinian",
  "batPony",
  "brahmin",
  "buffalo",
  "changeling",
  "crystalPony",
  "deer",
  "diamondDog",
  "donkey",
  "harpy",
  "hippogriff",
  "kirin",
  "minotaur",
  "yak"
] as const;

export type SpecialName = typeof SpecialNames[number];
export const SpecialNames = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
] as const;

/**
 * A custom typeguard to check whether a string is a valid SPECIAL name
 * @param name - the string to test
 * @returns whether the name is a SPECIAL name
 */
export function isSpecialName(name: string): name is SpecialName {
  return SpecialNames.includes(name as SpecialName);
}

export type ThaumaturgySpecial = Exclude<SpecialName, "luck">;
export const ThaumaturgySpecials = SpecialNames.filter(
  (special) => special !== "luck"
) as ThaumaturgySpecial[];

export type SkillName = typeof SkillNames[number];
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

/**
 * A custom typeguard to check whether a string is a valid Skill name
 * @param name - the string to test
 * @returns whether the name is a Skill name
 */
export function isSkillName(name: string): name is SkillName {
  return SkillNames.includes(name as SkillName);
}

/** Type names for the system's document types */
export const TYPES = {
  /** Type names for Actor types */
  ACTOR: {
    CHARACTER: "character"
  },
  /** Type names for Item types */
  ITEM: {
    AMMO: "ammo",
    APPAREL: "apparel",
    EFFECT: "effect",
    MISC: "misc",
    WEAPON: "weapon"
  }
} as const;

export type PhysicalItemType = typeof PhysicalItemTypes[number];
export const PhysicalItemTypes = [
  TYPES.ITEM.AMMO,
  TYPES.ITEM.APPAREL,
  TYPES.ITEM.MISC,
  TYPES.ITEM.WEAPON
] as const;

/**
 * A custom typeguard to check whether an item type is a physical item type.
 * @param type - the item type to test
 * @returns whether the type is a physical item type
 */
export function isPhysicalItemType(
  type: ValueOf<typeof TYPES["ITEM"]>
): type is PhysicalItemType {
  return PhysicalItemTypes.includes(type as PhysicalItemType);
}

export type Rarity = typeof Rarities[number];
export const Rarities = ["common", "uncommon", "rare", "exotic"] as const;

export type ApparelType = typeof ApparelTypes[number];
export const ApparelTypes = [
  "clothing",
  "lightArmor",
  "heavyArmor",
  "premiumArmor",
  "powerArmor",
  "accessory"
] as const;

export type ApparelSlot = typeof ApparelSlots[number];
export const ApparelSlots = [
  "armor",
  "belt",
  "clothing",
  "eyes",
  "mouth"
] as const;

export type Caliber = typeof Calibers[number];
export const Calibers = [
  ".308cal",
  ".44cal",
  ".50cal",
  "5mm",
  "5.56mm",
  "9mm",
  "10mm",
  "12.7mm",
  "20mm",
  "shotgunShell",
  "alienGemPack",
  "gemPack",
  "magicFusionCell",
  "energizedCrystalPack",
  "flamerFuel",
  "arrow",
  "rifleGrenade",
  "balefireEgg",
  "missile",
  "cloud",
  "improvised"
] as const;

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
    /** Bounds for the size category */
    size: {
      max: 4,
      min: -4
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
  needsMigrationVersion: "0.12.0",

  /** The number of fixed decimals to round floating point numbers to. */
  fixedDecimals: 2,

  /** Miscellaneous rules constants */
  rules: {
    /** Rule constants related to damage */
    damage: {
      /**
       * The die target which signals additional damage dealt when rolled
       * higher or equal.
       */
      dieTarget: 5
    },

    /** Rule constants related to melee */
    melee: {
      /** The melee maximum distance */
      distance: 2
    },

    /** Rule constants related to movement */
    movement: {
      /**
       * The amount of meters one AP spent in movement can move an actor by
       * default.
       */
      metersPerAp: 2
    }
  },

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
  } as Record<SkillName, SpecialName>,

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
    actor: {
      background: `${CONSTANTS.systemPath}/handlebars/actors/parts/background.hbs`,
      effects: `${CONSTANTS.systemPath}/handlebars/actors/parts/effects.hbs`,
      equipment: `${CONSTANTS.systemPath}/handlebars/actors/parts/equipment.hbs`,
      header: `${CONSTANTS.systemPath}/handlebars/actors/parts/header.hbs`,
      inventory: `${CONSTANTS.systemPath}/handlebars/actors/parts/inventory.hbs`,
      magic: `${CONSTANTS.systemPath}/handlebars/actors/parts/magic.hbs`,
      stats: `${CONSTANTS.systemPath}/handlebars/actors/parts/stats.hbs`
    },
    item: {
      header: `${CONSTANTS.systemPath}/handlebars/items/parts/header.hbs`,
      rules: `${CONSTANTS.systemPath}/handlebars/items/parts/ruleElements.hbs`
    }
  }
};

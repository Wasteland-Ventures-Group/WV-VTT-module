export type RadiationSicknessLevel = typeof RadiationSicknessLevels[number];
export const RadiationSicknessLevels = [
  "none",
  "minor",
  "moderate",
  "major",
  "critical"
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

export type Spirit = typeof Spirits[number];
export const Spirits = [
  "incantations",
  "embers",
  "machines",
  "nature",
  "serenity",
  "shadows",
  "streams",
  "trust",
  "whispers"
] as const;

export type Maneuver = typeof Maneuvers[number];
export const Maneuvers = [
  "agility",
  "endurance",
  "wonderboltAndTalon"
] as const;

export type Branch = typeof Branches[number];
export const Branches = ["charm", "might", "sight"] as const;

export type School = typeof Schools[number];
export const Schools = [
  "general",
  "conjuration",
  "dark",
  "enhancement",
  "illusion",
  "medical",
  "perception",
  "protective",
  "transmutation"
] as const;

export type MagicType = typeof MagicTypes[number];
export const MagicTypes = [
  "spirit",
  "unicorn",
  "earthPony",
  "maneuver"
] as const;

export const SchoolByMagicType = {
  unicorn: Schools as unknown,
  maneuver: Maneuvers as unknown,
  earthPony: Branches as unknown,
  spirit: Spirits as unknown
} as Record<MagicType, typeof GeneralMagicSchools>;

/**
 * Determines the type of magic based on its school
 * @param school - the school to categorise
 * @returns the type
 */
export function getMagicType(school: GeneralMagicSchool): MagicType {
  for (const magicType of MagicTypes) {
    const schoolFamily = SchoolByMagicType[magicType];
    if (schoolFamily.includes(school)) {
      return magicType;
    }
  }

  throw new Error("Unreachable Code");
}

/** A union of supported dice roll modes */
export type RollMode = ValueOf<typeof CONST.DICE_ROLL_MODES>;

/** A custom typeguard to check whether a string is a valid roll mode */
export function isRollMode(arg: string): arg is RollMode {
  return Object.values<string>(CONST.DICE_ROLL_MODES).includes(arg);
}

export type GeneralMagicSchool = typeof GeneralMagicSchools[number];
export const MagicSpecials: Record<GeneralMagicSchool, SpecialName[]> = {
  agility: ["agility"],
  endurance: ["endurance"],
  wonderboltAndTalon: ["agility", "endurance", "charisma"],
  charm: ["charisma"],
  might: ["strength"],
  sight: ["perception"],
  general: [
    "strength",
    "perception",
    "endurance",
    "charisma",
    "intelligence",
    "agility",
    "luck"
  ],
  conjuration: ["intelligence"],
  dark: ["endurance"],
  enhancement: ["charisma"],
  illusion: ["charisma"],
  medical: ["intelligence"],
  perception: ["perception"],
  protective: ["endurance"],
  transmutation: ["endurance"],
  incantations: [
    "strength",
    "perception",
    "endurance",
    "charisma",
    "intelligence",
    "agility",
    "luck"
  ],
  embers: ["agility"],
  machines: ["intelligence"],
  nature: ["endurance"],
  serenity: ["perception"],
  shadows: ["intelligence"],
  streams: ["endurance"],
  trust: ["charisma"],
  whispers: ["charisma"]
};

/**
 * Get the first element of all arrays present in `MagicSpecials`
 * @returns A record mapping a magic school to its default SPECIAL
 */
export function defaultMagicSpecial(): Record<GeneralMagicSchool, SpecialName> {
  return GeneralMagicSchools.reduce((acc, magicSchool) => {
    const magicSpecial = MagicSpecials[magicSchool][0];
    if (magicSpecial !== undefined) {
      acc[magicSchool] = magicSpecial;
    } else {
      throw Error(`School ${magicSchool} has no special attached to it`);
    }
    return acc;
  }, {} as Record<GeneralMagicSchool, SpecialName>);
}

/**
 * Computes the bonus to potency based on the value of the relevant SPECIAL
 * @param special - the value of the relevant SPECIAL
 * @returns the extra potency
 */
export function extraPotency(special: number): number {
  if (special >= 8) {
    return 3;
  } else if (special >= 4) {
    return 2;
  } else if (special >= 1) {
    return 1;
  } else {
    return 0;
  }
}
export const SpellRanges = [
  "none",
  "self",
  "touch",
  "other",
  "distance",
  "splash"
] as const;
export type SpellRange = typeof SpellRanges[number];

export const SplashSizes = ["tiny", "small", "large", "huge"] as const;
export type SplashSize = typeof SplashSizes[number];

export const TargetTypes = ["none", "self", "creature", "tile"] as const;
export type TargetType = typeof TargetTypes[number];

export const PainThresholds = [0, 1, 2, 3] as const;
export type PainThreshold = typeof PainThresholds[number];

export function getPainThreshold(hp: number): PainThreshold {
  if (hp > 5) {
    return 0;
  } else if (hp >= 4) {
    return 1;
  } else if (hp >= 2) {
    return 2;
  } else {
    return 3;
  }
}

export const GeneralMagicSchools = [
  "general",
  "conjuration",
  "dark",
  "enhancement",
  "illusion",
  "medical",
  "perception",
  "protective",
  "transmutation",
  "agility",
  "endurance",
  "wonderboltAndTalon",
  "incantations",
  "embers",
  "machines",
  "nature",
  "serenity",
  "shadows",
  "streams",
  "trust",
  "whispers",
  "charm",
  "might",
  "sight"
] as const;

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
    MAGIC: "magic",
    MISC: "misc",
    RACE: "race",
    WEAPON: "weapon"
  }
} as const;

export type SystemDocumentType =
  | ValueOf<typeof TYPES.ACTOR>
  | ValueOf<typeof TYPES.ITEM>;
export const SystemDocumentTypes: SystemDocumentType[] = [
  ...Object.values(TYPES.ACTOR),
  ...Object.values(TYPES.ITEM)
];

/** A type representing the different range brackets */
export enum RangeBracket {
  SHORT,
  MEDIUM,
  LONG,
  OUT_OF_RANGE
}

export type ProtoItemType = typeof ProtoItemTypes[number];
export const ProtoItemTypes: readonly ValueOf<typeof TYPES.ITEM>[] = [
  TYPES.ITEM.AMMO,
  TYPES.ITEM.APPAREL,
  TYPES.ITEM.MAGIC,
  TYPES.ITEM.MISC,
  TYPES.ITEM.RACE,
  TYPES.ITEM.WEAPON
] as const;

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

/**
 * A custom typeguard to check whether a given strings is an apparel slot name.
 * @param slot - the name of the slot to test
 * @returns whether the given name is an apparel slot name
 */
export function isApparelSlot(slot: string): slot is ApparelSlot {
  return ApparelSlots.includes(slot as ApparelSlot);
}

export type EquipmentSlot = typeof EquipmentSlots[number];
export const EquipmentSlots = [
  "readiedItem",
  "weaponSlot1",
  "weaponSlot2",
  "armor",
  "belt",
  "clothing",
  "eyes",
  "mouth"
] as const;

/**
 * A custom typeguard to check whether a given strings is an equipment slot
 * name.
 * @param slot - the name of the slot to test
 * @returns whether the given name is an equipment slot name
 */
export function isEquipmentSlot(slot: string): slot is EquipmentSlot {
  return EquipmentSlots.includes(slot as EquipmentSlot);
}

export type Caliber = typeof Calibers[number];
export const Calibers = [
  "308cal",
  "44cal",
  "50cal",
  "5mm",
  "5_56mm",
  "9mm",
  "10mm",
  "12_7mm",
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
        max: 10,
        min: 1
      },
      value: {
        max: 15,
        min: 0
      }
    },
    /** The minimum chance to fail a radiation or poison resistance check */
    effectMinChance: {
      poison: 0,
      radiation: 5
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
  needsMigrationVersion: "0.21.0",

  /** The number of fixed decimals to round floating point numbers to. */
  fixedDecimals: 2,

  /** Miscellaneous rules constants */
  rules: {
    /** Rule constants related to combat actions */
    actions: {
      /** Rule constants related to attack actions */
      attack: {
        /** Constants related to sneak attacks */
        sneak: {
          apCost: 2,
          criticalHitBonus: 15
        },
        /** Constants related to aimed attacks */
        aim: {
          apCost: 2,
          rollBonus: 10
        },
        /** Constants related to called shots */
        called: {
          apCost: 2
        }
      }
    },
    /** Rule constants related to damage */
    damage: {
      /**
       * The die target which signals additional damage dealt when rolled
       * higher or equal.
       */
      dieTarget: 5
    },

    /** Rule constants related to movement */
    movement: {
      /** The amount of AP needed to walk one meter. */
      apPerMeter: 0.5,

      /**
       * The amount of additional AP needed to walk one meter per crippled leg.
       */
      penaltyPerCrippledLeg: 0.5
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

export type RangePickingTag = typeof TAGS.rangePicking[number];
export const TAGS = {
  rangePicking: ["melee", "thrown"],
  skillDamageBonus: "skillful",
  sizeCategoryReachBonus: "melee"
} as const;

/** Check whether the given tag is one of the range picking tags. */
export function isRangePickingTag(tag: string): tag is RangePickingTag {
  return TAGS.rangePicking.includes(tag as RangePickingTag);
}

export const SYSTEM_COMPENDIUM_SOURCE_ID_REGEX = new RegExp(
  `^Compendium\\.(${CONSTANTS.systemId}\\.\\w+)\\.([a-zA-Z0-9]{16})$`
);

export const HANDLEBARS = {
  partPaths: {
    actor: {
      apparelSlot: `${CONSTANTS.systemPath}/handlebars/actors/parts/apparelSlot.hbs`,
      background: `${CONSTANTS.systemPath}/handlebars/actors/parts/background.hbs`,
      effects: `${CONSTANTS.systemPath}/handlebars/actors/parts/effects.hbs`,
      equipment: `${CONSTANTS.systemPath}/handlebars/actors/parts/equipment.hbs`,
      header: `${CONSTANTS.systemPath}/handlebars/actors/parts/header.hbs`,
      inventory: `${CONSTANTS.systemPath}/handlebars/actors/parts/inventory.hbs`,
      inventoryEquipmentSlot: `${CONSTANTS.systemPath}/handlebars/actors/parts/inventoryEquipmentSlot.hbs`,
      itemSlot: `${CONSTANTS.systemPath}/handlebars/actors/parts/itemSlot.hbs`,
      magic: `${CONSTANTS.systemPath}/handlebars/actors/parts/magic.hbs`,
      stats: `${CONSTANTS.systemPath}/handlebars/actors/parts/stats.hbs`,
      weaponSlot: `${CONSTANTS.systemPath}/handlebars/actors/parts/weaponSlot.hbs`
    },
    item: {
      baseItemInputs: `${CONSTANTS.systemPath}/handlebars/items/parts/baseItemInputs.hbs`,
      header: `${CONSTANTS.systemPath}/handlebars/items/parts/header.hbs`,
      physicalItemInputs: `${CONSTANTS.systemPath}/handlebars/items/parts/physicalItemInputs.hbs`,
      rules: `${CONSTANTS.systemPath}/handlebars/items/parts/ruleElements.hbs`
    }
  }
};

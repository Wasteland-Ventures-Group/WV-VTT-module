import type { JSONSchemaType } from "ajv";
import { MagicTypes, TYPES } from "../../../constants.js";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { z } from "zod";

export default interface RaceDataSource {
  type: typeof TYPES.ITEM.RACE;
  data: RaceDataSourceData;
}

/**
 * A type that reflects free things that are given to a character on creation
 */
export type FreeOnCreation = z.infer<typeof FREE_ON_CREATION_SCHEMA>;

export const FREE_ON_CREATION_SCHEMA = z.object({
  /** The character gets all of these on creation */
  allOf: z.array(z.string()).default([]),
  /** The character can pick n amount of these on creation */
  anyOf: z
    .object({
      /** The choices to pick from */
      choices: z.array(z.string()).default([]),
      /** The amount of things to pick */
      amount: z.number().int().default(0)
    })
    .default({}),
  /** Amount of free things to get in addition to allOf and anyOf */
  amount: z.number().int()
});

/**
 * A type that reflects free things that are given to a character on a period of
 * levels
 */
export type FreePerLevelPeriod = z.infer<typeof FREE_PER_LEVEL_PERIOD_SCHEMA>;
export const FREE_PER_LEVEL_PERIOD_SCHEMA = z.object({
  /**
   * The period of levels at which to gain new things.
   * @example A period of 5 would mean on 6th and 11th and so on…
   */
  period: z.number().default(0),
  /** Gain amount free things */
  amount: z.number().default(0)
});

/** Physical characteristics of a race. */
export type PhysicalSource = z.infer<typeof PHYSICAL_SOURCE_SCHEMA>;

export const PHYSICAL_SOURCE_SCHEMA = z.object({
  /** Whether this race can fly */
  canFly: z.boolean().default(false),

  /** Whether this race can use some form of magic */
  canUseMagic: z.boolean().default(false),

  /** Whether this race has a second head */
  hasSecondHead: z.boolean().default(false),

  /** Whether this race has a Special Talent */
  hasSpecialTalent: z.boolean().default(false),

  /** Whether this race has wings */
  hasWings: z.boolean().default(false)
});

export const PHYSICAL_SOURCE_JSON_SCHEMA: JSONSchemaType<PhysicalSource> = {
  description: "Phyiscal characteristics of a race",
  type: "object",
  properties: {
    canFly: {
      type: "boolean",
      default: false
    },
    canUseMagic: {
      type: "boolean",
      default: false
    },
    hasSecondHead: {
      type: "boolean",
      default: false
    },
    hasSpecialTalent: {
      type: "boolean",
      default: false
    },
    hasWings: {
      type: "boolean",
      default: false
    }
  },
  required: [
    "canFly",
    "canUseMagic",
    "hasSecondHead",
    "hasSpecialTalent",
    "hasWings"
  ],
  additionalProperties: false,
  default: {
    canFly: false,
    canUseMagic: false,
    hasSecondHead: false,
    hasSpecialTalent: false,
    hasWings: false
  }
};

/** Attributes of a race on character creation */
export type CreationAttributes = z.infer<typeof CREATION_ATTRIBUTES_SCHEMA>;
export const CREATION_ATTRIBUTES_SCHEMA = z.object({
  /**
   * How many SPECIAL points can be spent with this race at character creation
   */
  startingSpecialPoints: z.number().int().default(40),

  /** Magic types this race can choose from */
  magicTypes: z.array(z.enum(MagicTypes)).default([]),

  /** Attributes for free spells on character creation */
  freeSpells: FREE_ON_CREATION_SCHEMA,

  /** Attributes for free alchemy recipes on character creation */
  freeAlchemy: FREE_ON_CREATION_SCHEMA
});

/** Attributes of a race for leveling */
export type LevelingAttributes = z.infer<typeof LEVELING_SCHEMA>;

export const LEVELING_SCHEMA = z.object({
  /** The interval for free spells for the race */
  freeSpells: FREE_PER_LEVEL_PERIOD_SCHEMA,
  /** The interval for free alchemy for the race */
  freeAlchemy: FREE_PER_LEVEL_PERIOD_SCHEMA
});

export type RaceDataSourceData = z.infer<typeof RACE_SCHEMA>;
export const RACE_SCHEMA = BASE_ITEM_SCHEMA.extend({
  /** Physical characteristics of the race */
  physical: PHYSICAL_SOURCE_SCHEMA,

  /** Attributes of the race on character creation */
  creation: CREATION_ATTRIBUTES_SCHEMA,

  /** Attributes of the race for leveling */
  leveling: LEVELING_SCHEMA
});

export interface CompendiumRace
  extends FoundryCompendiumData<RaceDataSourceData> {
  type: typeof TYPES.ITEM.RACE;
}

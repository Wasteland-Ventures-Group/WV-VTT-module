import { MagicTypes, TYPES } from "../../../constants.js";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { z } from "zod";
import { zObject } from "../../common.js";

export default interface RaceDataSource {
  type: typeof TYPES.ITEM.RACE;
  data: RaceDataSourceData;
}

/**
 * A type that reflects free things that are given to a character on creation
 */
export type FreeOnCreation = z.infer<typeof RACE_FREE_ON_CREATION_SCHEMA>;
export const RACE_FREE_ON_CREATION_SCHEMA = z
  .object({
    /** The character gets all of these on creation */
    allOf: z
      .array(z.string())
      .default([])
      .describe("The character gets all of these on creation"),
    /** The character can pick n amount of these on creation */
    anyOf: z
      .object({
        /** The choices to pick from */
        choices: z
          .array(z.string())
          .default([])
          .describe("The choices to pick from"),
        /** The amount of things to pick */
        amount: z
          .number()
          .int()
          .default(0)
          .describe("The amount of things to pick")
      })
      .default({}),
    /** Amount of free things to get in addition to allOf and anyOf */
    amount: z
      .number()
      .int()
      .default(0)
      .describe("Amount of free things to get in addition to allOf and anyOf")
  })
  .default({});

/**
 * A type that reflects free things that are given to a character on a period of
 * levels
 */
export type FreePerLevelPeriod = z.infer<typeof FREE_PER_LEVEL_PERIOD_SCHEMA>;
export const FREE_PER_LEVEL_PERIOD_SCHEMA = zObject({
  /**
   * The period of levels at which to gain new things.
   * @example A period of 5 would mean on 6th and 11th and so on…
   */
  period: z
    .number()
    .default(0)
    .describe(
      "The period of levels at which to gain new things. Example: A period of " +
        "5 would mean on 6th and 11th and so on…"
    ),
  /** Gain amount free things */
  amount: z.number().default(0).describe("Gain amount free things")
});

/** Physical characteristics of a race. */
export type PhysicalSource = z.infer<typeof RACE_PHYSICAL_SCHEMA>;

export const RACE_PHYSICAL_SCHEMA = zObject({
  /** Whether this race can fly */
  canFly: z.boolean().default(false).describe("Whether this race can fly"),

  /** Whether this race can use some form of magic */
  canUseMagic: z
    .boolean()
    .default(false)
    .describe("Whether this race can use some form of magic"),

  /** Whether this race has a second head */
  hasSecondHead: z
    .boolean()
    .default(false)
    .describe("Whether this race has a second head"),

  /** Whether this race has a Special Talent */
  hasSpecialTalent: z
    .boolean()
    .default(false)
    .describe("Whether this race has a Special Talent"),

  /** Whether this race has wings */
  hasWings: z.boolean().default(false).describe("Whether this race has wings")
});

/** Attributes of a race on character creation */
export type CreationAttributes = z.infer<
  typeof RACE_CREATION_ATTRIBUTES_SCHEMA
>;
export const RACE_CREATION_ATTRIBUTES_SCHEMA = z
  .object({
    /**
     * How many SPECIAL points can be spent with this race at character creation
     */
    startingSpecialPoints: z
      .number()
      .int()
      .default(40)
      .describe(
        "How many SPECIAL points can be spent with this race at character creation"
      ),

    /** Magic types this race can choose from */
    magicTypes: z
      .array(z.enum(MagicTypes))
      .default([])
      .describe("Magic types this race can choose from"),

    /** Attributes for free spells on character creation */
    freeSpells: RACE_FREE_ON_CREATION_SCHEMA.default({}).describe(
      "Attributes for free spells on character creation"
    ),

    /** Attributes for free alchemy recipes on character creation */
    freeAlchemy: RACE_FREE_ON_CREATION_SCHEMA.default({}).describe(
      "Attributes for free alchemy recipes on character creation"
    )
  })
  .default({});

/** Attributes of a race for leveling */
export type LevelingAttributes = z.infer<typeof LEVELING_SCHEMA>;

export const LEVELING_SCHEMA = zObject({
  /** The interval for free spells for the race */
  freeSpells: FREE_PER_LEVEL_PERIOD_SCHEMA.default({}).describe(
    "The interval for free spells for the race"
  ),
  /** The interval for free alchemy for the race */
  freeAlchemy: FREE_PER_LEVEL_PERIOD_SCHEMA.default({}).describe(
    "The interval for free alchemy for the race"
  )
});

export type RaceDataSourceData = z.infer<typeof RACE_SCHEMA>;
export const RACE_SCHEMA = BASE_ITEM_SCHEMA.extend({
  /** Physical characteristics of the race */
  physical: RACE_PHYSICAL_SCHEMA.default({}).describe(
    "Physical characteristics of the race"
  ),

  /** Attributes of the race on character creation */
  creation: RACE_CREATION_ATTRIBUTES_SCHEMA.default({}).describe(
    "Physical characteristics of the race"
  ),

  /** Attributes of the race for leveling */
  leveling: LEVELING_SCHEMA.default({}).describe(
    "Attributes of the race for leveling"
  )
}).default({});

export const COMP_RACE_SCHEMA = compDataZodSchema(
  RACE_SCHEMA,
  "race",
  "icons/svg/mystery-man.svg",
  "New Race"
);

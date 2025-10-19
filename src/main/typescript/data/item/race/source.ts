import type { JSONSchemaType } from "ajv";
import { type MagicType, MagicTypes, TYPES } from "../../../constants.js";
import {
  BASE_ITEM_SCHEMA,
} from "../common/baseItem/source.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  type FoundryCompendiumData
} from "../../foundryCommon.js";
import fields = foundry.data.fields;

const PHYSICAL_SCHEMA = {
  /** Whether this race can fly */
  canFly: new fields.BooleanField({ required: true, initial: false }),
  /** Whether this race can use some form of magic */
  canUseMagic: new fields.BooleanField({ required: true, initial: false }),
  /** Whether this race has a second head */
  hasSecondHead: new fields.BooleanField({ required: true, initial: false }),
  /** Whether this race has a Special Talent */
  hasSpecialTalent: new fields.BooleanField({ required: true, initial: false }),
  /** Whether this race has wings */
  hasWings: new fields.BooleanField({ required: true, initial: false }),
}

const CREATION_ATTRIBUTES_SCHEMA = {
  /**
   * How many SPECIAL points can be spent with this race at character creation
   */
  startingSpecialPoints: new fields.IntegerSortField({ required: true, initial: 40 }),
}

export const RACE_SCHEMA = {
  /** Physical characteristics of the race */
  physical: new fields.SchemaField(PHYSICAL_SCHEMA),
  creation: new fields.SchemaField(CREATION_ATTRIBUTES_SCHEMA),
  ...BASE_ITEM_SCHEMA,
}


/**
 * A type that reflects free things that are given to a character on creation
 */
export class FreeOnCreation {
  /** The character gets all of these on creation */
  allOf: string[] = [];

  /** The character can pick n amount of these on creation */
  anyOf: {
    /** The choices to pick from */
    choices: string[];

    /** The amount of things to pick */
    amount: number;
  } = {
      choices: [],
      amount: 0
    };

  /** Amount of free things to get in addition to allOf and anyOf */
  amount = 0;
}

export const FREE_ON_CREATION_SCHEMA: JSONSchemaType<FreeOnCreation> = {
  description:
    "A schema to reflect free things that are given to a character on creation",
  type: "object",
  properties: {
    allOf: {
      description: "The character gets all of these on creation",
      type: "array",
      items: { type: "string" },
      default: []
    },
    anyOf: {
      description: "The character can pick n amount of these on creation",
      type: "object",
      properties: {
        choices: {
          description: "The choices to pick from",
          type: "array",
          items: { type: "string" },
          default: []
        },
        amount: {
          description: "The amount of things to pick",
          type: "number",
          default: 0
        }
      },
      required: ["amount", "choices"],
      additionalProperties: false,
      default: {
        choices: [],
        amount: 0
      }
    },
    amount: {
      description:
        "Amount of free things to get in addition to allOf and anyOf",
      type: "integer",
      default: 0
    }
  },
  required: ["anyOf", "allOf", "amount"],
  additionalProperties: false,
  default: {
    allOf: [],
    anyOf: {
      choices: [],
      amount: 0
    },
    amount: 0
  }
};

/**
 * A type that reflects free things that are given to a character on a period of
 * levels
 */
export class FreePerLevelPeriod {
  /**
   * The period of levels at which to gain new things.
   * @example A period of 5 would mean on 6th and 11th and so on…
   */
  period = 0;

  /** Gain amount free things */
  amount = 0;
}

export const FREE_PER_LEVEL_PERIOD_SCHEMA: JSONSchemaType<FreePerLevelPeriod> =
{
  description:
    "A schema to reflect free things that are given to a character on a period of levels",
  type: "object",
  properties: {
    period: {
      description: "The period of levels at which to gain new things.",
      type: "integer",
      default: 0
    },
    amount: {
      description: "Gain amount free things",
      type: "integer",
      default: 0
    }
  },
  required: ["period", "amount"],
  additionalProperties: false,
  default: {
    period: 0,
    amount: 0
  }
};

/** Physical characteristics of a race. */
export class PhysicalSource {
}

/** Attributes of a race on character creation */
export class CreationAttributes {
  /** Magic types this race can choose from */
  magicTypes: MagicType[] = [];

  /** Attributes for free spells on character creation */
  freeSpells = new FreeOnCreation();

  /** Attributes for free alchemy recipes on character creation */
  freeAlchemy = new FreeOnCreation();
}

const CREATION_ATTRIBUTES_SCHEMA_JSON: JSONSchemaType<CreationAttributes> = {
  description: "Attributes of a race on character creation",
  type: "object",
  properties: {
    magicTypes: {
      type: "array",
      items: {
        type: "string",
        enum: MagicTypes
      }
    },
    freeSpells: FREE_ON_CREATION_SCHEMA,
    freeAlchemy: FREE_ON_CREATION_SCHEMA
  },
  required: [
    "magicTypes",
    "freeSpells",
    "freeAlchemy"
  ],
  additionalProperties: false,
  default: {
    startingSpecialPoints: 40,
    magicTypes: [],
  }
};

/** Attributes of a race for leveling */
export class LevelingAttributes {
  /** The leveling period for free spells of the race */
  freeSpells = new FreePerLevelPeriod();

  /** The leveling period for free alchemy recipes of the race */
  freeAlchemy = new FreePerLevelPeriod();
}

export const LEVELING_ATTRIBUTES_JSON_SCHEMA: JSONSchemaType<LevelingAttributes> =
{
  description: "A schema for attributes of a race for leveling",
  type: "object",
  properties: {
    freeSpells: FREE_PER_LEVEL_PERIOD_SCHEMA,
    freeAlchemy: FREE_PER_LEVEL_PERIOD_SCHEMA
  },
  required: ["freeSpells", "freeAlchemy"],
  additionalProperties: false,
  default: {
  }
};

class RaceDataSourceData {
  /** Attributes of the race on character creation */
  creation = new CreationAttributes();

  /** Attributes of the race for leveling */
  leveling = new LevelingAttributes();
}

export interface CompendiumRace
  extends FoundryCompendiumData<RaceDataSourceData> {
  type: typeof TYPES.ITEM.RACE;
}

export const COMP_RACE_JSON_SCHEMA: JSONSchemaType<CompendiumRace> = {
  description: "The compendium data for a race Item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.RACE,
      default: TYPES.ITEM.RACE
    },
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.RACE,
    img: "icons/svg/mystery-man.svg"
  }
};

import type { JSONSchemaType } from "ajv";
import { MagicType, MagicTypes, TYPES } from "../../../constants.js";
import BaseItemSource, {
  BASE_ITEM_SOURCE_JSON_SCHEMA
} from "../common/baseItem/source.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";

export default interface RaceDataSource {
  type: typeof TYPES.ITEM.RACE;
  data: RaceDataSourceData;
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
      definition: "The character gets all of these on creation",
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
  /** Whether this race can fly */
  canFly = false;

  /** Whether this race can use some form of magic */
  canUseMagic = false;

  /** Whether this race has a second head */
  hasSecondHead = false;

  /** Whether this race has a Special Talent */
  hasSpecialTalent = false;

  /** Whether this race has wings */
  hasWings = false;
}

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
export class CreationAttributes {
  /**
   * How many SPECIAL points can be spent with this race at character creation
   */
  startingSpecialPoints = 40;

  /** Magic types this race can choose from */
  magicTypes: MagicType[] = [];

  /** Attributes for free spells on character creation */
  freeSpells = new FreeOnCreation();

  /** Attributes for free alchemy recipes on character creation */
  freeAlchemy = new FreeOnCreation();
}

export const CREATION_ATTRIBUTES_SCHEMA: JSONSchemaType<CreationAttributes> = {
  description: "Attributes of a race on character creation",
  type: "object",
  properties: {
    startingSpecialPoints: {
      type: "integer",
      default: 40
    },
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
    "startingSpecialPoints",
    "magicTypes",
    "freeSpells",
    "freeAlchemy"
  ],
  additionalProperties: false,
  default: {
    startingSpecialPoints: 40,
    magicTypes: [],
    freeSpells: FREE_ON_CREATION_SCHEMA.defaults,
    freeAlchemy: FREE_ON_CREATION_SCHEMA.defaults
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
      freeSpells: FREE_PER_LEVEL_PERIOD_SCHEMA.default,
      freeAlchemy: FREE_PER_LEVEL_PERIOD_SCHEMA.default
    }
  };

export class RaceDataSourceData extends BaseItemSource {
  /** Physical characteristics of the race */
  physical = new PhysicalSource();

  /** Attributes of the race on character creation */
  creation = new CreationAttributes();

  /** Attributes of the race for leveling */
  leveling = new LevelingAttributes();
}

export const RACE_SOURCE_JSON_SCHEMA: JSONSchemaType<RaceDataSourceData> = {
  description: "The system data for a race item",
  type: "object",
  properties: {
    ...BASE_ITEM_SOURCE_JSON_SCHEMA.properties,
    physical: PHYSICAL_SOURCE_JSON_SCHEMA,
    creation: CREATION_ATTRIBUTES_SCHEMA,
    leveling: LEVELING_ATTRIBUTES_JSON_SCHEMA
  },
  required: [
    ...BASE_ITEM_SOURCE_JSON_SCHEMA.required,
    "physical",
    "creation",
    "leveling"
  ],
  additionalProperties: false,
  default: {
    ...BASE_ITEM_SOURCE_JSON_SCHEMA.default,
    physical: PHYSICAL_SOURCE_JSON_SCHEMA.default,
    creation: CREATION_ATTRIBUTES_SCHEMA.default,
    leveling: LEVELING_ATTRIBUTES_JSON_SCHEMA.default
  }
};

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
    data: RACE_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.RACE,
    data: RACE_SOURCE_JSON_SCHEMA.default,
    img: "icons/svg/mystery-man.svg"
  }
};

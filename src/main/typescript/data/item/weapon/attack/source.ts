import type { JSONSchemaType } from "ajv";
import {
  ModifiableNumber,
  MODIFIABLE_NUMBER_JSON_SCHEMA
} from "../../../common.js";

/** A Weapon Attacks DB container */
export default class AttacksSource {
  /** The source objects for the Attacks */
  sources: Record<string, AttackSource> = {};
}

/** The Attack raw data layout */
export interface AttackSource {
  /** The values related to the damage the weapon causes */
  damage: {
    /** The base damage amount */
    base: ModifiableNumber;

    /** The number of d6 to throw for variable damage */
    dice: ModifiableNumber;

    /** Whether the damage uses a dice range based on actor Strength */
    diceRange?: boolean;

    /** The optional damage fall-off type of the attack */
    damageFallOff?: DamageFallOffType | "";
  };

  /** The amount of rounds used with the attack */
  rounds?: number;

  /**
   * The damage threshold reduction of the attack. By default the attack has no
   * DT reduction.
   */
  dtReduction?: number;

  /** The splash radius. By default the attack has no splash. */
  splash?: "TODO"; // TODO: implement an enum or similar

  /** The amount of action points needed to attack */
  ap: ModifiableNumber;
}

/** A type representing different damage fall-off rules */
export type DamageFallOffType = typeof DamageFallOffTypes[number];
const DamageFallOffTypes = ["shotgun"] as const;

/** The default value for the damage object */
const DAMAGE_DEFAULT = { base: { source: 0 }, dice: { source: 0 } };

/** A JSON schema for attack source objects */
export const ATTACK_JSON_SCHEMA: JSONSchemaType<AttackSource> = {
  description: "A single attack definition",
  type: "object",
  properties: {
    damage: {
      description: "The damage definition of the attack",
      type: "object",
      properties: {
        base: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA,
          description: "The flat base damage of the attack",
          properties: {
            source: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            },
            total: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        dice: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA,
          description: "The amount of d6 to throw for variable damage",
          properties: {
            source: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            },
            total: {
              ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        diceRange: {
          description:
            "Whether the dice property is the minimum value for Strength " +
            "based a dice range. If this is not specified, it defaults to " +
            "`false`.",
          type: "boolean",
          nullable: true,
          default: true
        },
        damageFallOff: {
          description: "The type of damage fall-off for the attack.",
          type: "string",
          enum: ["", ...DamageFallOffTypes],
          nullable: true,
          default: ""
        }
      },
      required: ["base", "dice"],
      additionalProperties: false,
      default: DAMAGE_DEFAULT
    },
    rounds: {
      description:
        "The amount of ammo used by the attack. If this is not specified " +
        "the attack does not consume ammo.",
      type: "integer",
      nullable: true,
      default: 1
    },
    dtReduction: {
      description:
        "The amount of DT reduction on the target. If this is not specified " +
        "the attack has no DT reduction.",
      type: "integer",
      nullable: true,
      default: 1
    },
    splash: {
      description:
        "The splash of the weapon. This is still work in progress and has no " +
        "effect.",
      type: "string",
      nullable: true,
      default: "TODO"
    },
    ap: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "The amount of action points used by the attack.",
      properties: {
        source: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        },
        total: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    }
  },
  required: ["damage", "ap"],
  additionalProperties: false,
  default: {
    damage: DAMAGE_DEFAULT,
    ap: 0
  }
};

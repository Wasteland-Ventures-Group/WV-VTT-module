import type { JSONSchemaType } from "ajv";

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
    base: number;

    /** The number of d6 to throw for variable damage */
    dice: number;

    /** Whether the damage uses a dice range based on actor Strength */
    diceRange?: boolean;

    /** The optional damage fall-off type of the attack */
    damageFallOff?: DamageFallOffSource;
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
  ap: number;
}

/** A type representing different damage fall-off rules */
type DamageFallOffSource = "shotgun";

/** The default value for the damage object */
const DAMAGE_DEFAULT = { base: 0, dice: 0 };

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
          description: "The flat base damage of the attack",
          type: "integer",
          default: 0
        },
        dice: {
          description: "The amount of d6 to throw for variable damage",
          type: "integer",
          default: 0
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
          description:
            "The type of damage fall-off for the attack. If this is not " +
            "specified, the attack has no damage fall-off.",
          type: "string",
          enum: ["shotgun"],
          nullable: true,
          default: "shotgun"
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
      description: "The amount of action points used by the attack.",
      type: "integer",
      default: 0
    }
  },
  required: ["damage", "ap"],
  additionalProperties: false,
  default: {
    damage: DAMAGE_DEFAULT,
    ap: 0
  }
};

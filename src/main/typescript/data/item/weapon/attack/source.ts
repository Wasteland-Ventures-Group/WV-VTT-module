import type { JSONSchemaType } from "ajv";
import { SplashSizes } from "../../../../constants.js";
import fields = foundry.data.fields;
import { CompositeNumberField } from "../../../common.js";

export const DAMAGE_SCHEMA = {
  /** The base damage amount */
  base: CompositeNumberField.create({ min: 0, initial: 0 })
}
export const ATTACK_SCHEMA = {
  name: new fields.StringField({ required: true }),
  damage: new fields.SchemaField(DAMAGE_SCHEMA),
};

class AttackSourceOld {
  /** The values related to the damage the weapon causes */
  damage = new DamageSource();

  /** The amount of rounds used with the attack */
  rounds?: CompositeNumberSource = { source: 0 };

  /** The damage threshold reduction of the attack */
  dtReduction?: CompositeNumberSource = { source: 0 };

  /** The splash radius */
  splash?: SplashSize;

  /** The amount of action points needed to attack */
  ap: CompositeNumberSource = { source: 0 };

  /** Tags of the attack */
  tags: string[] = [];
}

/** The source data for weapon damage */
class DamageSource {
  /** The number of d6 to throw for variable damage */
  dice: CompositeNumberSource = { source: 0 };

  /** Whether the damage uses a dice range based on actor Strength */
  diceRange?: boolean;

  /** The optional damage fall-off type of the attack */
  damageFallOff?: DamageFallOffType | "";
}

export type DamageFallOffType = (typeof DamageFallOffTypes)[number];
const DamageFallOffTypes = ["shotgun"] as const;

const DAMAGE_DEFAULT = { base: { source: 0 }, dice: { source: 0 } };

export const ATTACK_JSON_SCHEMA: JSONSchemaType<AttackSource> = {
  description: "A single attack definition",
  type: "object",
  properties: {
    damage: {
      description: "The damage definition of the attack",
      type: "object",
      properties: {
        base: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
          description: "The flat base damage of the attack",
          properties: {
            source: {
              ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
              type: "integer",
              default: 0
            }
          },
          default: {
            source: 0
          }
        },
        dice: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
          description: "The amount of d6 to throw for variable damage",
          properties: {
            source: {
              ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
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
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description:
        "The amount of ammo used by the attack. If this is not specified " +
        "the attack does not consume ammo.",
      nullable: true,
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    },
    dtReduction: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description:
        "The amount of DT reduction on the target. If this is not specified " +
        "the attack has no DT reduction.",
      nullable: true,
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    },
    splash: {
      description:
        "The splash of the weapon. This is still work in progress and has no " +
        "effect.",
      type: "string",
      enum: SplashSizes,
      nullable: true,
      default: "tiny"
    },
    ap: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description: "The amount of action points used by the attack.",
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    },
    tags: {
      ...TAGS_SOURCE_JSON_SCHEMA,
      description: "Tags of the attack"
    }
  },
  required: ["damage", "ap", "tags"],
  additionalProperties: false,
  default: {
    damage: DAMAGE_DEFAULT,
    ap: { source: 0 },
    tags: []
  }
};

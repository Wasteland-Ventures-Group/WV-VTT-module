import type { JSONSchemaType } from "ajv";

/** A Weapon Attacks DB container */
export class AttacksSource {
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

    /**
     * Whether the die property is the minimum value of a die range. By default
     * this is false.
     */
    diceRange?: boolean;

    /**
     * The type of damage fall-off for the attack. By default the attack has no
     * fall-off.
     */
    damageFallOff?: DamageFallOff;
  };

  /**
   * The amount of rounds used with the attack. By default the attack does not
   * consume rounds.
   */
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
type DamageFallOff = "shotgun";

/** A JSON schema for attack source objects */
export const JSON_SCHEMA: JSONSchemaType<AttackSource> = {
  type: "object",
  properties: {
    damage: {
      type: "object",
      properties: {
        base: { type: "integer" },
        dice: { type: "integer" },
        diceRange: { type: "boolean", default: false, nullable: true },
        damageFallOff: { type: "string", enum: ["shotgun"], nullable: true }
      },
      required: ["base", "dice"],
      additionalProperties: false
    },
    rounds: { type: "integer", nullable: true },
    dtReduction: { type: "integer", nullable: true },
    splash: { type: "string", default: "TODO", nullable: true },
    ap: { type: "integer" }
  },
  required: ["damage", "ap"],
  additionalProperties: false
};

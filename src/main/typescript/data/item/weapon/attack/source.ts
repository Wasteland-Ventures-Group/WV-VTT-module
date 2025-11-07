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
  /** The values related to the damage the weapon causes */
  damage: new fields.SchemaField(DAMAGE_SCHEMA),
  /** The amount of rounds used with the attack */
  rounds: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** The damage threshold reduction of the attack */
  dtReduction: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** The amount of action points needed to attack */
  ap: CompositeNumberField.create({ min: 1, initial: 0 }),
  /** The splash radius */
  splash: new fields.StringField({ required: false, choices: SplashSizes }),
  /** Tags of the attack */
  tags: new fields.ArrayField(new fields.StringField({ required: true }), { required: true, initial: [] })
};

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

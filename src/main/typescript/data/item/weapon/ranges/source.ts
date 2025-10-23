import { SpecialNames } from "../../../../constants.js";
import { CompositeNumberField } from "../../../common.js";

import fields = foundry.data.fields;

export const DISTANCE_SCHEMA = {
  /** The base distance of the range distance in meters */
  base: CompositeNumberField.create({ initial: 20 }),
  /** The SPECIAL multiplier of the range distance */
  multiplier: CompositeNumberField.create({ initial: 0 }),
  /** The name of the SPECIAL to use for the range distance */
  special: new fields.StringField({ choices: SpecialNames }),
}

const DISTANCE_FIELD = new fields.SchemaField(DISTANCE_SCHEMA)

export const RANGE_SCHEMA = {
  /** The skill check modifier associated with this range */
  modifier: CompositeNumberField.create({ initial: 0 }),
  /** Tags of the range */
  tags: new fields.ArrayField(new fields.StringField({ required: true })),
  /** The distance of the range */
  distance: DISTANCE_FIELD,
}
const RANGE_FIELD = new fields.SchemaField(RANGE_SCHEMA)

export const RANGES_SCHEMA = {
  /** The short range of the weapon */
  short: RANGE_FIELD,
  /** The medium range of the weapon */
  medium: RANGE_FIELD,
  /** The long range of the weapon */
  long: RANGE_FIELD,
}

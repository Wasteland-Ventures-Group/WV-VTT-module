import { SpellRanges, SplashSizes } from "../../../../constants.js";
import { CompositeNumberField } from "../../../common.js";
import fields = foundry.data.fields;

export const RANGE_SCHEMA = {
  /** The type of range this spell can have. */
  type: new fields.StringField({ choices: SpellRanges }),
  /** The flat, non-scaling part of a spell's range (provided it has a range of 'distance'). */
  distanceBase: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** How much potency influences the range of a spell with a range of 'distance' */
  distanceScale: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** The size of the splash, provided this spell has a range of 'splash'" */
  splashSize: new fields.StringField({ choices: SplashSizes, required: false }),
  /** Description of the range, if the spell has a range of 'other'" */
  description: new fields.StringField(),
}

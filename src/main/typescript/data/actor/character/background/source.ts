import { CONSTANTS } from "../../../../constants.js";
import { COMPOSITE_NUMBER_FIELD, } from "../../../common.js";

import fields = foundry.data.fields;

export const BACKGROUND_SCHEMA = {
  /** The age of the character */
  age: new fields.StringField(),

  /** The gender of the character */
  gender: new fields.StringField(),

  /** The cutie mark description of the character */
  cutieMark: new fields.StringField(),

  /** The appearance of the character */
  appearance: new fields.StringField(),

  /** The background of the character */
  background: new fields.StringField(),

  /** The fears of the character */
  fears: new fields.StringField(),

  /** The dreams of the character */
  dreams: new fields.StringField(),

  /** The karma of the character */
  karma: new fields.NumberField({
    integer: true,
    max: CONSTANTS.bounds.karma.max,
    min: CONSTANTS.bounds.karma.min,
    required: true,
    nullable: false,
    initial: 0,
  }),

  /** The size of the character */
  size: COMPOSITE_NUMBER_FIELD,

  /** The personality of the character */
  personality: new fields.StringField(),

  /** The social contacts of the character */
  socialContacts: new fields.StringField(),

  /** The special talent description of the character */
  specialTalent: new fields.StringField(),

  /** The virtue of the character */
  virtue: new fields.StringField(),
}

export type BackgroundSource = fields.SchemaField.InitializedData<typeof BACKGROUND_SCHEMA>;

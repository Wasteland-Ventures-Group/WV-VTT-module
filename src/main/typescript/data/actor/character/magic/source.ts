import {
  SpecialNames, MagicSpecials,
} from "../../../../constants.js";

import fields = foundry.data.fields;

const SPECIAL_FIELD = new fields.StringField({ choices: SpecialNames });
const MAGIC_SPECIALS_SCHEMA =
  Object.entries(MagicSpecials).reduce((acc, [school, _]) => {
    acc[school] = SPECIAL_FIELD;
    return acc;
  }, {} as Record<string, typeof SPECIAL_FIELD>)

const THAUMATURGY_SPECIAL_FIELD = new fields.StringField({ required: true, choices: SpecialNames.filter((name) => name != "luck") });

export const CHARACTER_MAGIC_SCHEMA = {
  /** The SPECIAL of the character associated with the Thaumaturgy skill */
  thaumSpecial: THAUMATURGY_SPECIAL_FIELD,
  /**
   * A mapping of school to the attribute that determines its potency, but only
   * for schools that may have multiple choices in the matter.
   */
  magicSpecials: new fields.SchemaField(MAGIC_SPECIALS_SCHEMA),
}

export type MagicSource = fields.SchemaField.InitializedData<typeof CHARACTER_MAGIC_SCHEMA>;

import { GeneralMagicSchools } from "../../../constants.js";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";
import { TARGET_SCHEMA } from "./target/source.js";
import { RANGE_SCHEMA } from "./ranges/source.js";
import { CompositeNumberField } from "../../common.js";
import fields = foundry.data.fields;

export const MAGIC_SCHEMA = {
  /** Which school does this spell belong to? */
  school: new fields.StringField({ choices: GeneralMagicSchools, required: true, nullable: false }),
  /** How much AP does the spell cost to cast? */
  apCost: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** How much strain does the spell cost to cast? */
  strainCost: CompositeNumberField.create({ min: 0, initial: 0 }),
  /** What kind of target does this spell apply to? */
  target: new fields.SchemaField(TARGET_SCHEMA),
  /** What is the range of the spell? */
  range: new fields.SchemaField(RANGE_SCHEMA),
  ...BASE_ITEM_SCHEMA
}

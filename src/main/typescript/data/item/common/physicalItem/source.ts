import { Rarities, } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SCHEMA, } from "../../../common.js";
import { BASE_ITEM_SCHEMA, } from "../baseItem/source.js";

import fields = foundry.data.fields;

/**
 * This holds the sources of the base values that all physical items have in
 * common.
 */
export type PhysicalItemSource = fields.SchemaField.InitializedData<typeof PHYS_ITEM_SCHEMA>;

export const PHYS_ITEM_SCHEMA = {
  /** The rarity of the item */
  rarity: new fields.StringField({ required: false, initial: "common", nullable: false, choices: Rarities }),
  /** The value of the item in caps (can be floating point) */
  value: new fields.SchemaField(COMPOSITE_NUMBER_SCHEMA, { initial: { source: 0 } }),
  /** The weight of the item in kg (can be floating point) */
  weight: new fields.SchemaField(COMPOSITE_NUMBER_SCHEMA, { initial: { source: 0 } }),
  ...BASE_ITEM_SCHEMA
};

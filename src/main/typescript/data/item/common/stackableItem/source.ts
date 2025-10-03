import { PHYS_ITEM_SCHEMA, } from "../physicalItem/source.js";
import fields = foundry.data.fields;

export const STACKABLE_ITEM_SCHEMA = {
  /** The amount of the item */
  amount: new fields.NumberField({ min: 0, required: true, nullable: false, initial: 1 }),
  ...PHYS_ITEM_SCHEMA,
}

/**
 * This holds the sources of the base values that all stackable physical items
 * have in common.
 */
export type StackableItemSource = fields.SchemaField.InitializedData<typeof STACKABLE_ITEM_SCHEMA>;

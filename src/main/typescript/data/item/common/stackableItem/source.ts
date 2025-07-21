import type { JSONSchemaType } from "ajv";
import {
  PhysicalItemSource,
  PHYS_ITEM_SCHEMA,
  PHYS_ITEM_SOURCE_JSON_SCHEMA
} from "../physicalItem/source.js";
import fields = foundry.data.fields;

/**
 * This holds the sources of the base values that all stackable physical items
 * have in common.
 */
export default abstract class StackableItemSource extends PhysicalItemSource {
  /** The amount of the item */
  amount: number = 1;
}

export const STACKABLE_ITEM_SCHEMA = {
  /** The amount of the item */
  amount: new fields.NumberField({ min: 0, required: true, nullable: false, initial: 1 }),
  ...PHYS_ITEM_SCHEMA,
}

export const STACK_ITEM_SOURCE_JSON_SCHEMA: JSONSchemaType<StackableItemSource> =
{
  description: "Common system data for stackable physical Items",
  type: "object",
  properties: {
    ...PHYS_ITEM_SOURCE_JSON_SCHEMA.properties,
    amount: {
      description: "The amount of the item",
      type: "number",
      default: 1,
      minimum: 1
    }
  },
  required: [...PHYS_ITEM_SOURCE_JSON_SCHEMA.required, "amount"],
  additionalProperties: false,
  default: {
    amount: 1
  }
};

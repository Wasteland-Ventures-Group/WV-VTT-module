import { z } from "zod";
import { PHYS_ITEM_SCHEMA } from "../physicalItem/source.js";
import zodToJsonSchema from "zod-to-json-schema";

/**
 * This holds the sources of the base values that all stackable physical items
 * have in common.
 */
export type StackableItemSource = z.infer<typeof STACK_ITEM_SOURCE_SCHEMA>;
export const STACK_ITEM_SOURCE_SCHEMA = PHYS_ITEM_SCHEMA.extend({
  /** The amount of the item */
  amount: z.number().default(1)
});

export const STACK_ITEM_SOURCE_JSON_SCHEMA = zodToJsonSchema(
  STACK_ITEM_SOURCE_SCHEMA
);

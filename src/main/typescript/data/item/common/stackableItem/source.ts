import { z } from "zod";
import { PHYS_ITEM_SOURCE_SCHEMA } from "../physicalItem/source.js";

/**
 * This holds the sources of the base values that all stackable physical items
 * have in common.
 */
export default type StackableItemSource = z.infer<typeof STACK_ITEM_SOURCE_SCHEMA>
export const STACK_ITEM_SOURCE_SCHEMA = PHYS_ITEM_SOURCE_SCHEMA.extend({
  /** The amount of the item */
  amount: z.number().default(1)
});

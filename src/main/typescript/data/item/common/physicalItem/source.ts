import { z } from "zod";
import { Rarities } from "../../../../constants.js";
import { COMP_NUM_SCHEMA } from "../../../common.js";
import { BASE_ITEM_SCHEMA } from "../baseItem/source.js";

/**
 * This holds the sources of the base values that all physical items have in
 * common.
 */
export type PhysicalItemSource = z.infer<typeof PHYS_ITEM_SOURCE_SCHEMA>;
export const PHYS_ITEM_SOURCE_SCHEMA = BASE_ITEM_SCHEMA.extend({
  /** The rarity of the item */
  rarity: z.enum(Rarities).default("common"),
  /** The value of the item in caps (can be floating point) */
  value: COMP_NUM_SCHEMA,
  /** The weight of the item in kg (can be floating point) */
  weight: COMP_NUM_SCHEMA
});

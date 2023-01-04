import { z } from "zod";
import { Rarities } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA } from "../../../common.js";
import { BASE_ITEM_SCHEMA } from "../baseItem/source.js";

/**
 * This holds the sources of the base values that all physical items have in
 * common.
 */
export type PhysicalItemSource = z.infer<typeof PHYS_ITEM_SCHEMA>;
export const PHYS_ITEM_SCHEMA = BASE_ITEM_SCHEMA.extend({
  /** The rarity of the item */
  rarity: z.enum(Rarities).default("common").describe("The rarity of the item"),
  /** The value of the item in caps (can be floating point) */
  value: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The value of the item in caps (can be floating point)"
  ),
  /** The weight of the item in kg (can be floating point) */
  weight: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}).describe(
    "The weight of the item in kg (can be floating point)"
  )
});

import { z } from "zod";
import { RULES_SCHEMA } from "../rules/source.js";

/** This holds the source of the base values that all items have in common. */
export type BaseItemSource = z.infer<typeof BASE_ITEM_SCHEMA>;
export const BASE_ITEM_SCHEMA = z.object({
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name: z
    .string()
    .describe(
      "The name of the item in the Wasteland Wares list. This is not the name " +
        "a player can give their specific instance of an item, but rather the " +
        'name of * the item "prototype".'
    ),
  /** The description of the item in the Wasteland Wares list */
  description: z
    .string()
    .default("")
    .describe("The description of the item in the Wasteland Wares list"),
  /** User provided notes */
  notes: z.string().default("").describe("User provided notes"),
  /** The RuleElement sources of the item */
  rules: RULES_SCHEMA.default({}).describe(
    "The RuleElement sources of the item"
  ),
  /** Tags of the item */
  tags: z.array(z.string()).default([]).describe("Tags of the item")
});

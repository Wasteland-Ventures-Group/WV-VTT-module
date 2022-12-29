import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { RULES_SOURCE_SCHEMA } from "../rules/source.js";

/** This holds the source of the base values that all items have in common. */

export type BaseItemSource = z.infer<typeof BASE_ITEM_SCHEMA>;
export const BASE_ITEM_SCHEMA = z.object({
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name: z.string().default(""),
  /** The description of the item in the Wasteland Wares list */
  description: z.string().default(""),
  /** User provided notes */
  notes: z.string().default(""),
  /** The RuleElement sources of the item */
  rules: RULES_SOURCE_SCHEMA.default({}),
  /** Tags of the item */
  tags: z.array(z.string()).default([])
});

/** A JSON schema for base item objects */
export const BASE_ITEM_SOURCE_JSON_SCHEMA = zodToJsonSchema(
  BASE_ITEM_SCHEMA,
  "Base Item"
);

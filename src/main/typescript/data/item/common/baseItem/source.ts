import type { JSONSchemaType } from "ajv";
import { z } from "zod";
import { RULES_SOURCE_SCHEMA } from "../rules/source.js";

/** This holds the source of the base values that all items have in common. */

export default interface BaseItemSource extends z.infer<typeof BASE_ITEM_SCHEMA> {};
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

export const TAGS_SOURCE_JSON_SCHEMA: JSONSchemaType<string[]> = {
  type: "array",
  items: { type: "string" },
  default: []
};

/** A JSON schema for base item objects */
/*
export const BASE_ITEM_SOURCE_JSON_SCHEMA: JSONSchemaType<BaseItemSource> = {
  description: "Common system data for items",
  type: "object",
  properties: {
    name: {
      description:
        "The name of the item in the system wares list. This can not be " +
        "easily changed by players. A custom or unique item should have the " +
        "name of the normal, listed item it is based on set here.",
      type: "string",
      default: ""
    },
    description: {
      description: "A description text for the item",
      type: "string",
      default: ""
    },
    notes: {
      description:
        "Notes for the item. This could for example be additional rules.",
      type: "string",
      default: ""
    },
    rules: {
      description: "The rule elements structure for the item",
      type: "object",
      properties: {
        sources: {
          description: "The rule element sources for the item",
          type: "array",
          items: RULE_ELEMENT_SOURCE_JSON_SCHEMA,
          default: []
        }
      },
      required: ["sources"],
      additionalProperties: false,
      default: { sources: [] }
    },
    tags: {
      ...TAGS_SOURCE_JSON_SCHEMA,
      description: "Tags of the item"
    }
  },
  required: ["name", "description", "notes", "rules", "tags"],
  additionalProperties: false,
  default: {
    name: "",
    description: "",
    notes: "",
    rules: { sources: [] },
    tags: []
  }
};
*/
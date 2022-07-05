import type { JSONSchemaType } from "ajv";
import { KnownTag, KnownTags } from "../../../../constants.js";
import { RULE_ELEMENT_SOURCE_JSON_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";
import RulesSource from "../rules/source.js";

/** This holds the source of the base values that all items have in common. */
export default abstract class BaseItemSource {
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name = "";

  /** The description of the item in the Wasteland Wares list */
  description = "";

  /** User provided notes */
  notes = "";

  /** The RuleElement sources of the item */
  rules = new RulesSource();

  /** Tags of the item */
  tags: KnownTag[] = [];
}

/** A JSON schema for base item objects */
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
      description: "Tags of the item",
      type: "array",
      items: {
        type: "string",
        enum: KnownTags
      },
      default: []
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

import type { JSONSchemaType } from "ajv";
import { JSON_SCHEMA as RULE_ELEMENT_SOURCE_SCHEMA } from "../../ruleEngine/ruleElementSource.js";
import type { TemplateDocumentType } from "../common.js";
import { DbRules } from "./rules/source.js";

/** This holds the base values that all items have in common. */
export default abstract class BaseItem implements TemplateDocumentType {
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name: string = "";

  /** The description of the item in the Wasteland Wares list. */
  description: string = "";

  /** User provided notes. */
  notes: string = "";

  /** The rules of the item. */
  rules: DbRules = new DbRules();

  /** @override */
  abstract getTypeName(): string;
}

/** A JSON schema for base item objects */
export const JSON_SCHEMA: JSONSchemaType<BaseItem> = {
  type: "object",
  properties: {
    name: { type: "string", default: "" },
    description: { type: "string", default: "" },
    notes: { type: "string", default: "" },
    rules: {
      type: "object",
      properties: {
        sources: {
          type: "array",
          items: RULE_ELEMENT_SOURCE_SCHEMA,
          default: []
        }
      },
      required: ["sources"],
      additionalProperties: false
    },
    getTypeName: { type: "object" }
  },
  required: ["name", "description", "notes", "rules"],
  additionalProperties: false
};

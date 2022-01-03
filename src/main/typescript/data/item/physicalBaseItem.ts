import type { JSONSchemaType } from "ajv";
import BaseItem, { JSON_SCHEMA as BASE_ITEM_JSON_SCHEMA } from "./baseItem.js";

/** This holds the base values that all physical items have in common. */
export default abstract class PhysicalBaseItem extends BaseItem {
  /** The value of the item in caps */
  value: number = 0;

  /** The weight of the item in kg (can be floating point) */
  weight: number = 0;
}

/** A JSOn schema for physical base item objects */
export const JSON_SCHEMA: JSONSchemaType<PhysicalBaseItem> = {
  type: "object",
  properties: {
    ...BASE_ITEM_JSON_SCHEMA.properties,
    value: { type: "integer", default: 0 },
    weight: { type: "number", default: 0 }
  },
  required: [...BASE_ITEM_JSON_SCHEMA.required, "value", "weight"],
  additionalProperties: false
};

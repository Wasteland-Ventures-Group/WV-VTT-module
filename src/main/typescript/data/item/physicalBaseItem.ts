import type { JSONSchemaType } from "ajv";
import { Rarities, Rarity } from "../../constants.js";
import BaseItem, { BASE_ITEM_JSON_SCHEMA } from "./baseItem.js";

/** This holds the base values that all physical items have in common. */
export default abstract class PhysicalBaseItem extends BaseItem {
  /** The rarity of the item */
  rarity: Rarity = "common";

  /** The value of the item in caps */
  value: number = 0;

  /** The weight of the item in kg (can be floating point) */
  weight: number = 0;
}

/** A JSOn schema for physical base item objects */
export const PHYS_BASE_ITEM_JSON_SCHEMA: JSONSchemaType<PhysicalBaseItem> = {
  description: "Commmon system data for a physical Item",
  type: "object",
  properties: {
    ...BASE_ITEM_JSON_SCHEMA.properties,
    rarity: {
      description: "The rarity of the item",
      type: "string",
      default: "common",
      enum: Rarities
    },
    value: {
      description: "The value of the item in caps",
      type: "integer",
      default: 0
    },
    weight: {
      description: "The weight of the item in kg (can be floating point)",
      type: "number",
      default: 0
    }
  },
  required: [...BASE_ITEM_JSON_SCHEMA.required, "value", "weight"],
  additionalProperties: false,
  default: {
    ...BASE_ITEM_JSON_SCHEMA.default,
    rarity: "common",
    value: 0,
    weight: 0
  }
};

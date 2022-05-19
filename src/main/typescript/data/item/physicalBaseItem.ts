import type { JSONSchemaType } from "ajv";
import { Rarities, Rarity } from "../../constants.js";
import { ModifiableNumber, MODIFIABLE_NUMBER_JSON_SCHEMA } from "../common.js";
import BaseItem, { BASE_ITEM_JSON_SCHEMA } from "./baseItem.js";

/** This holds the base values that all physical items have in common. */
export default abstract class PhysicalBaseItem extends BaseItem {
  /** The rarity of the item */
  rarity: Rarity = "common";

  /** The value of the item in caps (can be floating point) */
  value = new ModifiableNumber(0);

  /** The weight of the item in kg (can be floating point) */
  weight = new ModifiableNumber(0);
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
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "The value of the item in caps (can be floating point)",
      default: {
        source: 0
      }
    },
    weight: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "The weight of the item in kg (can be floating point)",
      default: {
        source: 0
      }
    }
  },
  required: [...BASE_ITEM_JSON_SCHEMA.required, "rarity", "value", "weight"],
  additionalProperties: false,
  default: {
    ...BASE_ITEM_JSON_SCHEMA.default,
    rarity: "common",
    value: 0,
    weight: 0
  }
};

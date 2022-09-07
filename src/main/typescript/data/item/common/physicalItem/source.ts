import type { JSONSchemaType } from "ajv";
import { Rarities, Rarity } from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../../common.js";
import BaseItemSource, {
  BASE_ITEM_SOURCE_JSON_SCHEMA
} from "../baseItem/source.js";

/**
 * This holds the sources of the base values that all physical items have in
 * common.
 */
export default abstract class PhysicalItemSource extends BaseItemSource {
  /** The rarity of the item */
  rarity: Rarity = "common";

  /** The value of the item in caps (can be floating point) */
  value: CompositeNumberSource = { source: 0 };

  /** The weight of the item in kg (can be floating point) */
  weight: CompositeNumberSource = { source: 0 };
}

/** A JSOn schema for physical base item objects */
export const PHYS_ITEM_SOURCE_JSON_SCHEMA: JSONSchemaType<PhysicalItemSource> =
  {
    description: "Commmon system data for a physical Item",
    type: "object",
    properties: {
      ...BASE_ITEM_SOURCE_JSON_SCHEMA.properties,
      rarity: {
        description: "The rarity of the item",
        type: "string",
        default: "common",
        enum: Rarities
      },
      value: {
        ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
        description: "The value of the item in caps (can be floating point)",
        default: {
          source: 0
        }
      },
      weight: {
        ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
        description: "The weight of the item in kg (can be floating point)",
        default: {
          source: 0
        }
      }
    },
    required: [
      ...BASE_ITEM_SOURCE_JSON_SCHEMA.required,
      "rarity",
      "value",
      "weight"
    ],
    additionalProperties: false,
    default: {
      ...BASE_ITEM_SOURCE_JSON_SCHEMA.default,
      rarity: "common",
      value: {
        source: 0
      },
      weight: {
        source: 0
      }
    }
  };

import type { JSONSchemaType } from "ajv";
import PhysicalItemSource, {
  PHYS_ITEM_SOURCE_JSON_SCHEMA
} from "../physicalItem/source.js";

/**
 * This holds the sources of the base values that all stackable physical items
 * have in common.
 */
export default abstract class StackableItemSource extends PhysicalItemSource {
  /** The amount of the item */
  amount: number = 1;
}

export const STACK_ITEM_SOURCE_JSON_SCHEMA: JSONSchemaType<StackableItemSource> =
  {
    description: "Common system data for stackable physical Items",
    type: "object",
    properties: {
      ...PHYS_ITEM_SOURCE_JSON_SCHEMA.properties,
      amount: {
        description: "The amount of the item",
        type: "number",
        default: 1,
        minimum: 1
      }
    },
    required: [...PHYS_ITEM_SOURCE_JSON_SCHEMA.required, "amount"],
    additionalProperties: false,
    default: {
      ...PHYS_ITEM_SOURCE_JSON_SCHEMA.default,
      amount: 1
    }
  };

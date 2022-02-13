import type { JSONSchemaType } from "ajv";
import PhysicalBaseItem, {
  PHYS_BASE_ITEM_JSON_SCHEMA
} from "./physicalBaseItem.js";

export default abstract class StackableBaseItem extends PhysicalBaseItem {
  /** The amount of the item */
  amount: number = 1;
}

export const STACK_BASE_ITEM_JSON_SCHEMA: JSONSchemaType<StackableBaseItem> = {
  description: "Common system data for stackable physical Items",
  type: "object",
  properties: {
    ...PHYS_BASE_ITEM_JSON_SCHEMA.properties,
    amount: {
      description: "The amount of the item",
      type: "number",
      default: 1,
      minimum: 1
    }
  },
  required: [...PHYS_BASE_ITEM_JSON_SCHEMA.required, "amount"],
  additionalProperties: false,
  default: {
    ...PHYS_BASE_ITEM_JSON_SCHEMA.default,
    amount: 1
  }
};

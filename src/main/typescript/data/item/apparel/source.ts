import type { JSONSchemaType } from "ajv";
import {
  ApparelSlot,
  ApparelSlots,
  ApparelType,
  ApparelTypes,
  TYPES
} from "../../../constants.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import PhysicalBaseItem, {
  PHYS_BASE_ITEM_JSON_SCHEMA
} from "../physicalBaseItem.js";

/** The Apparel Item data-source */
export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

/** The Apparel Item data-source data */
export class ApparelDataSourceData extends PhysicalBaseItem {
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots?: ApparelSlot[] = [];

  /** The damage threshold of the apparel */
  damageThreshold?: number = 0;

  /** The number of quick slots of the apparel */
  quickSlots?: number = 0;

  /** The number of mod slots of the apparel */
  modSlots?: number = 0;

  /** The apparel slot this apparel occupies when equipped */
  slot: ApparelSlot = "clothing";

  /** The sub type of the apparel */
  type: ApparelType = "clothing";
}

/** A JSON schema for apparel source objects */
export const APPAREL_SOURCE_JSON_SCHEMA: JSONSchemaType<ApparelDataSourceData> =
  {
    description: "The system data for an apparel item",
    type: "object",
    properties: {
      ...PHYS_BASE_ITEM_JSON_SCHEMA.properties,
      blockedSlots: {
        description:
          "The other apparel slots this apparel blocks aside from its own",
        type: "array",
        items: {
          type: "string",
          enum: ApparelSlots
        },
        default: []
      },
      damageThreshold: {
        description: "The damage threshold of the apparel",
        type: "integer",
        default: 0
      },
      quickSlots: {
        description: "The number of quick slots of the apparel",
        type: "integer",
        default: 0,
        minimum: 0
      },
      modSlots: {
        description: "The number of mod slots of the apparel",
        type: "integer",
        default: 0,
        minimum: 0
      },
      slot: {
        description: "The apparel slot this apparel occupies when equipped",
        type: "string",
        enum: ApparelSlots
      },
      type: {
        description: "The sub type of the apparel",
        type: "string",
        enum: ApparelTypes
      }
    },
    required: [...PHYS_BASE_ITEM_JSON_SCHEMA.required, "slot", "type"],
    additionalProperties: false,
    default: {
      ...PHYS_BASE_ITEM_JSON_SCHEMA.default,
      slot: "clothing",
      type: "clothing"
    }
  };

export interface CompendiumApparel
  extends FoundryCompendiumData<ApparelDataSourceData> {
  type: typeof TYPES.ITEM.APPAREL;
}

export const COMP_APPAREL_JSON_SCHEMA: JSONSchemaType<CompendiumApparel> = {
  description: "The compendium data for an apparel Item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.APPAREL,
      default: TYPES.ITEM.APPAREL
    },
    data: APPAREL_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.APPAREL,
    data: APPAREL_SOURCE_JSON_SCHEMA.default
  }
};

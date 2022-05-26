import type { JSONSchemaType } from "ajv";
import {
  ApparelSlot,
  ApparelSlots,
  ApparelType,
  ApparelTypes,
  TYPES
} from "../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../common.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import PhysicalItemSource, {
  PHYS_ITEM_SOURCE_JSON_SCHEMA
} from "../common/physicalItem/source.js";

export default interface ApparelDataSource {
  type: typeof TYPES.ITEM.APPAREL;
  data: ApparelDataSourceData;
}

export class ApparelDataSourceData extends PhysicalItemSource {
  /** The other apparel slots this apparel blocks aside from its own */
  blockedSlots?: ApparelSlot[] = [];

  /** The damage threshold of the apparel */
  damageThreshold?: CompositeNumberSource = { source: 0 };

  /** The number of quick slots of the apparel */
  quickSlots?: CompositeNumberSource = { source: 0 };

  /** The number of mod slots of the apparel */
  modSlots?: CompositeNumberSource = { source: 0 };

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
      ...PHYS_ITEM_SOURCE_JSON_SCHEMA.properties,
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
        ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
        description: "The damage threshold of the apparel",
        properties: {
          source: {
            ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
            type: "integer",
            default: 0
          }
        },
        default: {
          source: 0
        }
      },
      quickSlots: {
        ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
        description: "The number of quick slots of the apparel",
        properties: {
          source: {
            ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
            type: "integer",
            default: 0,
            minimum: 0
          }
        },
        default: {
          source: 0
        }
      },
      modSlots: {
        ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
        description: "The number of mod slots of the apparel",
        properties: {
          source: {
            ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
            type: "integer",
            default: 0,
            minimum: 0
          }
        },
        default: {
          source: 0
        }
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
    required: [...PHYS_ITEM_SOURCE_JSON_SCHEMA.required, "slot", "type"],
    additionalProperties: false,
    default: {
      ...PHYS_ITEM_SOURCE_JSON_SCHEMA.default,
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
    data: APPAREL_SOURCE_JSON_SCHEMA.default,
    img: "icons/equipment/chest/breastplate-leather-brown-belted.webp"
  }
};

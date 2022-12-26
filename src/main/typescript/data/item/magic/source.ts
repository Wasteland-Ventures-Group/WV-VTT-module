import { TYPES, GeneralMagicSchools } from "../../../constants.js";
import { RANGE_SCHEMA } from "./ranges/source.js";
import { TargetSchema } from "./target/source.js";
import { CompositeNumberSchema } from "../../common.js";
import { z } from "zod";
import {
  compDataZodSchema,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import zodToJsonSchema from "zod-to-json-schema";
import { BASE_ITEM_SCHEMA } from "../common/baseItem/source.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export const MagicDataSchema = BASE_ITEM_SCHEMA.extend({
  school: z.enum(GeneralMagicSchools).default("general"),
  apCost: CompositeNumberSchema,
  strainCost: CompositeNumberSchema,
  range: RANGE_SCHEMA,
  target: TargetSchema
}).default({});

export interface CompendiumMagic
  extends FoundryCompendiumData<MagicDataSourceData> {
  type: typeof TYPES.ITEM.MAGIC;
}

export const COMP_MAGIC_JSON_SCHEMA = zodToJsonSchema(
  compDataZodSchema(MagicDataSchema, "icons/svg/daze.svg", "")
);

export type MagicDataSourceData = z.infer<typeof MagicDataSchema>;
/** A JSON schema for magic source objects */
/*
export const MAGIC_SOURCE_JSON_SCHEMA: JSONSchemaType<MagicDataSourceData> = {
  description: "The system data for a magic Item",
  type: "object",
  properties: {
    ...BASE_ITEM_SOURCE_JSON_SCHEMA.properties,
    school: {
      description: "The school/branch/spirit of the spell",
      type: "string",
      enum: GeneralMagicSchools,
      default: "general"
    },
    apCost: {
      description: "The ability point cost of the spell",
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
    },
    strainCost: {
      description: "The strain cost of the spell",
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
    },
    range: {
      ...RANGES_JSON_SCHEMA
    },
    target: {
      ...TARGET_JSON_SCHEMA
    }
  },
  required: [...BASE_ITEM_SOURCE_JSON_SCHEMA.required, "school"],
  additionalProperties: false,
  default: {
    ...BASE_ITEM_SOURCE_JSON_SCHEMA.default,
    school: "general"
  }
};

export const COMP_MAGIC_JSON_SCHEMA: JSONSchemaType<CompendiumMagic> = {
  description: "The compendium data for a magic Item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.MAGIC,
      default: TYPES.ITEM.MAGIC
    },
    data: MAGIC_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.MAGIC,
    data: MAGIC_SOURCE_JSON_SCHEMA.default,
    img: "icons/svg/daze.svg"
  }
};

*/

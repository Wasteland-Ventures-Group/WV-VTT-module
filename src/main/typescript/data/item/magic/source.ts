import type { JSONSchemaType } from "ajv";
import {
  GeneralMagicSchools,
  TYPES,
  GeneralMagicSchool
} from "../../../constants.js";
import BaseItemSource, {
  BASE_ITEM_SOURCE_JSON_SCHEMA
} from "../common/baseItem/source.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import { RangeSource, RANGES_JSON_SCHEMA } from "./ranges/source.js";
import { TargetSource, TARGET_JSON_SCHEMA } from "./target/source.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../common.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export class MagicDataSourceData extends BaseItemSource {
  school: GeneralMagicSchool = "general";

  apCost: CompositeNumberSource = { source: 0 };

  strainCost: CompositeNumberSource = { source: 0 };

  range: RangeSource = new RangeSource();

  target: TargetSource = new TargetSource();
}

/** A JSON schema for magic source objects */
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

export interface CompendiumMagic
  extends FoundryCompendiumData<MagicDataSourceData> {
  type: typeof TYPES.ITEM.MAGIC;
}

/** A JSON schema for compendium magic objects */
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

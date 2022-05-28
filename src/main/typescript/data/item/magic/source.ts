import type { JSONSchemaType } from "ajv";
import {
  Branch,
  GeneralMagicSchools,
  Maneuver,
  School,
  Spirit,
  SpellRanges,
  TYPES,
  SplashSizes
} from "../../../constants.js";
import BaseItem, {
  BASE_ITEM_SOURCE_JSON_SCHEMA
} from "../common/baseItem/source.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";

/** The Magic Item data-source */
export default interface MagicDataSource {
  type: typeof TYPES.ITEM.MAGIC;
  data: MagicDataSourceData;
}

export class MagicDataSourceData extends BaseItem {
  school: School | Spirit | Branch | Maneuver = "general";
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
      type: "number",
      default: 0
    },
    strainCost: {
      description: "The strain cost of the spell",
      type: "number",
      default: 0
    },
    range: {
      description: "The spell's range, if it has one",
      type: "string",
      default: "none",
      enum: SpellRanges,
      properties: {
        rangeScale: {
          description:
            "How much potency influences the range of a spell with a range of 'distance'",
          type: "number",
          default: 1
        },
        rangeBase: {
          description:
            "The flat, non-scaling part of a spell's range (provided it has a range of 'distance').",
          type: "number",
          default: 0
        },
        rangeSplash: {
          description:
            "The size of the splash, provided this spell has a range of 'splash'",
          type: "string",
          enum: SplashSizes,
          default: "tiny"
        }
      }
    },
    areaOfEffect: {
      description: "The spell's area of effect",
      type: "string",
      default: "none",
      enum: SplashSizes.concat(["none"]) // probably not the right way, will figure it out later
    },
    target: {
      description: "Information relating to the spell's target",
      targetCount: {
        description: "The number of creatures this spell can target",
        type: "number",
        default: 0
      }
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
    img: "icons/weapons/wands/wand-totem.webp"
  }
};

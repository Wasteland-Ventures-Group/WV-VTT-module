import type { JSONSchemaType } from "ajv";
import { TYPES } from "../../../constants.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import StackableItemSource, {
  STACK_ITEM_SOURCE_JSON_SCHEMA
} from "../common/stackableItem/source.js";

export default interface MiscDataSource {
  type: typeof TYPES.ITEM.MISC;
  data: MiscDataSourceData;
}

export class MiscDataSourceData extends StackableItemSource {}

export interface CompendiumMisc
  extends FoundryCompendiumData<MiscDataSourceData> {
  type: typeof TYPES.ITEM.MISC;
}

export const COMP_MISC_JSON_SCHEMA: JSONSchemaType<CompendiumMisc> = {
  description: "The compendium data for a miscelleneous item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.MISC,
      default: TYPES.ITEM.MISC
    },
    data: STACK_ITEM_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.MISC,
    data: STACK_ITEM_SOURCE_JSON_SCHEMA.default,
    img: "icons/svg/item-bag.svg"
  }
};

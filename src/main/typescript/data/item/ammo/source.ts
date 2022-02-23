import type { JSONSchemaType } from "ajv";
import { Caliber, Calibers, TYPES } from "../../../constants.js";
import {
  COMPENDIUM_JSON_SCHEMA,
  FoundryCompendiumData
} from "../../foundryCommon.js";
import StackableBaseItem, {
  STACK_BASE_ITEM_JSON_SCHEMA
} from "../stackableBaseItem.js";

/** The Ammo Item data-source */
export default interface AmmoDataSource {
  type: typeof TYPES.ITEM.AMMO;
  data: AmmoDataSourceData;
}

/** The Ammo Item data-source data */
export class AmmoDataSourceData extends StackableBaseItem {
  /** The caliber of the ammo */
  caliber: Caliber = ".308cal";

  /** The sub type of the ammo */
  type: string = "";
}

/** A JSON schema for ammo source objects */
export const AMMO_SOURCE_JSON_SCHEMA: JSONSchemaType<AmmoDataSourceData> = {
  description: "The system data for an ammo Item",
  type: "object",
  properties: {
    ...STACK_BASE_ITEM_JSON_SCHEMA.properties,
    caliber: {
      description: "The caliber of the ammo",
      type: "string",
      enum: Calibers,
      default: ".308cal"
    },
    type: {
      description: "The sub type of the ammo",
      type: "string"
    }
  },
  required: [...STACK_BASE_ITEM_JSON_SCHEMA.required, "caliber", "type"],
  additionalProperties: false,
  default: {
    ...STACK_BASE_ITEM_JSON_SCHEMA.default,
    caliber: ".308cal",
    type: ""
  }
};

export interface CompendiumAmmo
  extends FoundryCompendiumData<AmmoDataSourceData> {
  type: typeof TYPES.ITEM.AMMO;
}

/** A JSON schema for compendium ammo objects */
export const COMP_AMMO_JSON_SCHEMA: JSONSchemaType<CompendiumAmmo> = {
  description: "The compendium data for an ammo Item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.AMMO,
      default: TYPES.ITEM.AMMO
    },
    data: AMMO_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.AMMO,
    data: AMMO_SOURCE_JSON_SCHEMA.default
  }
};

import type { JSONSchemaType } from "ajv";
import { Caliber, Calibers } from "../../../../constants.js";
import {
  ModifiableNumber,
  MODIFIABLE_NUMBER_JSON_SCHEMA
} from "../../../common.js";

/** A type specifying the way a weapon is reloaded */
export default interface ReloadSource {
  /** The amount of action points needed to reload */
  ap: ModifiableNumber;

  /** The caliber, used by the weapon */
  caliber: Caliber;

  /** The ammon container type of the weapon */
  containerType: AmmoContainerType;

  /** The amount of ammo that fits into the weapon's ammo container */
  size: ModifiableNumber;
}

/** A type for ammo containers */
export type AmmoContainerType = typeof AmmoContainerTypes[number];
const AmmoContainerTypes = ["internal", "magazine"] as const;

/** A JSON schema for reload objects */
export const RELOAD_JSON_SCHEMA: JSONSchemaType<ReloadSource> = {
  description: "A reload specification",
  type: "object",
  properties: {
    ap: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description: "The amount of action points used by the reload",
      properties: {
        source: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0,
          minimum: 0
        },
        total: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
          type: "integer",
          default: 0,
          minimum: 0
        }
      },
      default: {
        source: 0
      }
    },
    caliber: {
      description: "The caliber used by the weapon.",
      type: "string",
      default: "308cal",
      enum: Calibers
    },
    containerType: {
      description: "The type of the ammo container used by the weapon",
      type: "string",
      enum: AmmoContainerTypes,
      default: "magazine"
    },
    size: {
      ...MODIFIABLE_NUMBER_JSON_SCHEMA,
      description:
        "The size of the ammo container used by the weapon. If this is zero, the weapon does not support reloading.",
      properties: {
        source: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0,
          minimum: 0
        },
        total: {
          ...MODIFIABLE_NUMBER_JSON_SCHEMA.properties.total,
          type: "integer",
          default: 0,
          minimum: 0
        }
      },
      default: {
        source: 0
      }
    }
  },
  required: ["ap", "caliber", "containerType", "size"],
  additionalProperties: false,
  default: {
    ap: {
      source: 0
    },
    caliber: "308cal",
    containerType: "magazine",
    size: {
      source: 0
    }
  }
};

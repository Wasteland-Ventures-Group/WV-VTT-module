import type { JSONSchemaType } from "ajv";
import { Caliber, Calibers } from "../../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../../common.js";

export default class ReloadSource {
  /** The amount of action points needed to reload */
  ap: CompositeNumberSource = { source: 0 };

  /** The caliber, used by the weapon */
  caliber: Caliber = "308cal";

  /** The ammo container type of the weapon */
  containerType: AmmoContainerType = "magazine";

  /** The amount of ammo that fits into the weapon's ammo container */
  size: CompositeNumberSource = { source: 0 };
}

export type AmmoContainerType = typeof AmmoContainerTypes[number];
const AmmoContainerTypes = ["internal", "magazine"] as const;

export const RELOAD_JSON_SCHEMA: JSONSchemaType<ReloadSource> = {
  description: "A reload specification",
  type: "object",
  properties: {
    ap: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description: "The amount of action points used by the reload",
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
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description:
        "The size of the ammo container used by the weapon. If this is zero, the weapon does not support reloading.",
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

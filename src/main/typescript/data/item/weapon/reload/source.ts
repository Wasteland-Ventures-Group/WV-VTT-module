import type { JSONSchemaType } from "ajv";
import { Caliber, Calibers } from "../../../../constants.js";

/** A type specifying the way a weapon is reloaded */
export default interface ReloadSource {
  /** The amount of action points needed to reload */
  ap: number;

  /** The caliber, used by the weapon */
  caliber: Caliber;

  /** The ammon container type of the weapon */
  containerType: AmmoContainerSource;

  /** The amount of ammo that fits into the weapon's ammo container */
  size: number;
}

/** A type for ammo containers */
type AmmoContainerSource = "internal" | "magazine";

/** A JSON schema for reload objects */
export const RELOAD_JSON_SCHEMA: JSONSchemaType<ReloadSource> = {
  description: "A reload specification",
  type: "object",
  properties: {
    ap: {
      description: "The amount of action points used by the reload",
      type: "integer",
      default: 0
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
      enum: ["internal", "magazine"],
      default: "magazine"
    },
    size: {
      description: "The size of the ammo container used by the weapon",
      type: "integer",
      default: 0
    }
  },
  required: ["ap", "caliber", "containerType", "size"],
  additionalProperties: false,
  default: {
    ap: 0,
    caliber: "308cal",
    containerType: "magazine",
    size: 0
  }
};

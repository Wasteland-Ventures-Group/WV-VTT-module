import type { JSONSchemaType } from "ajv";

/** A type specifying the way a weapon is reloaded */
export interface Reload {
  /** The amount of action points needed to reload */
  ap: number;

  /** The caliber, used by the weapon */
  caliber: "TODO"; // TODO: maybe make caliber a different item type?

  /** The ammon container type of the weapon */
  containerType: AmmoContainer;

  /** The amount of ammo that fits into the weapon's ammo container */
  size: number;
}

/** A type for ammo containers */
type AmmoContainer = "internal" | "magazine";

/** A JSON schema for reload objects */
export const JSON_SCHEMA: JSONSchemaType<Reload> = {
  type: "object",
  properties: {
    ap: { type: "integer" },
    caliber: { type: "string", const: "TODO" },
    containerType: { type: "string", enum: ["internal", "magazine"] },
    size: { type: "integer" }
  },
  required: ["ap", "caliber", "containerType", "size"],
  additionalProperties: false
};

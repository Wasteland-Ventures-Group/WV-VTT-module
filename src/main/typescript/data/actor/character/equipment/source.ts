import type { JSONSchemaType } from "ajv";

/** An actor equipment object for the database */
export default class EquipmentSource {
  /** The amount of caps the actor owns */
  caps: number = 0;
}

export const EQUIPMENT_JSON_SCHEMA: JSONSchemaType<EquipmentSource> = {
  description: "An equipment specification",
  type: "object",
  properties: {
    caps: {
      description: "The amount of caps the actor owns",
      type: "integer",
      default: 0
    }
  },
  required: ["caps"],
  additionalProperties: false,
  default: {
    caps: 0
  }
};

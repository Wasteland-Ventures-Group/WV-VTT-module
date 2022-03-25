import type { JSONSchemaType } from "ajv";
import { Resource, RESOURCE_JSON_SCHEMA } from "../../../foundryCommon.js";

/** An Actor vitals object for the database */
export default class VitalsSource {
  /** The current amount of hit points of an Actor */
  hitPoints = new Resource(15);

  /** The current amount of action points of an Actor */
  actionPoints = new Resource(12);

  /** The current insanity of an Actor */
  insanity = new Resource(0);

  /** The current strain of an Actor */
  strain = new Resource(20);

  /** The current dose of absorbed radiation of an Actor */
  radiationDose = 0;
}

export const VITALS_JSON_SCHEMA: JSONSchemaType<VitalsSource> = {
  description: "A vitals specification",
  type: "object",
  properties: {
    hitPoints: RESOURCE_JSON_SCHEMA,
    actionPoints: RESOURCE_JSON_SCHEMA,
    insanity: RESOURCE_JSON_SCHEMA,
    strain: RESOURCE_JSON_SCHEMA,
    radiationDose: {
      description: "The absorbed dose of radition of an Actor",
      type: "integer",
      default: 0,
      minimum: 0
    }
  },
  required: [
    "hitPoints",
    "actionPoints",
    "insanity",
    "strain",
    "radiationDose"
  ],
  additionalProperties: false,
  default: {
    hitPoints: { value: 15 },
    actionPoints: { value: 12 },
    insanity: { value: 0 },
    strain: { value: 20 },
    radiationDose: 0
  }
};

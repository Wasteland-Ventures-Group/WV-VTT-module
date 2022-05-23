import type { JSONSchemaType } from "ajv";
import { Resource, RESOURCE_JSON_SCHEMA } from "../../../foundryCommon.js";

export default class VitalsSource {
  /** The hit points of the character */
  hitPoints = new Resource(15);

  /** The action points of the character */
  actionPoints = new Resource(12);

  /** The insanity of the character */
  insanity = new Resource(0);

  /** The strain of the character */
  strain = new Resource(20);

  /** The absorbed dose of radiation of the character */
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
      description: "The absorbed dose of radition of the character",
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

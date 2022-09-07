import type { JSONSchemaType } from "ajv";
import {
  ResourceSource,
  RESOURCE_SOURCE_JSON_SCHEMA
} from "../../../foundryCommon.js";

export class PairedLimbCrippledStatus {
  /** The status of the left limb */
  left = false;

  /** The status of the right limb */
  right = false;
}

export class LegsCrippledStatus {
  /** The status of the front legs */
  front = new PairedLimbCrippledStatus();

  /** The status of the rear legs */
  rear = new PairedLimbCrippledStatus();
}

export class LimbsCrippledStatus {
  /** The crippled limb status of the torso */
  torso = false;

  /** The crippled limb status of the head */
  head = false;

  /** The crippled limb status of the legs */
  legs = new LegsCrippledStatus();

  /** The crippled limb status of the wings */
  wings = new PairedLimbCrippledStatus();
}

export default class VitalsSource {
  /** The hit points of the character */
  hitPoints: ResourceSource = { value: 15 };

  /** The action points of the character */
  actionPoints: ResourceSource = { value: 12 };

  /** The insanity of the character */
  insanity: ResourceSource = { value: 0 };

  /** The strain of the character */
  strain: ResourceSource = { value: 20 };

  /** The absorbed dose of radiation of the character */
  radiationDose = 0;

  /** The crippled status of the character's limbs */
  crippledLimbs = new LimbsCrippledStatus();
}

const PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA: JSONSchemaType<PairedLimbCrippledStatus> =
  {
    description: "A schema for paired limb crippled status",
    type: "object",
    properties: {
      left: {
        description: "The status of the left limb",
        type: "boolean",
        default: false
      },
      right: {
        description: "The status of the right limb",
        type: "boolean",
        default: false
      }
    },
    required: ["left", "right"],
    additionalProperties: false,
    default: {
      left: false,
      right: false
    }
  };

export const VITALS_JSON_SCHEMA: JSONSchemaType<VitalsSource> = {
  description: "A vitals specification",
  type: "object",
  properties: {
    hitPoints: RESOURCE_SOURCE_JSON_SCHEMA,
    actionPoints: RESOURCE_SOURCE_JSON_SCHEMA,
    insanity: RESOURCE_SOURCE_JSON_SCHEMA,
    strain: RESOURCE_SOURCE_JSON_SCHEMA,
    radiationDose: {
      description: "The absorbed dose of radition of the character",
      type: "integer",
      default: 0,
      minimum: 0
    },
    crippledLimbs: {
      description: "The crippled status of the character's limbs",
      type: "object",
      properties: {
        torso: {
          description: "The crippled limb status of the torso",
          type: "boolean",
          default: false
        },
        head: {
          description: "The crippled limb status of the head",
          type: "boolean",
          default: false
        },
        legs: {
          description: "The crippled limb status of the legs",
          type: "object",
          properties: {
            front: {
              ...PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA,
              description: "The status of the front legs"
            },
            rear: {
              ...PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA,
              description: "The status of the rear legs"
            }
          },
          required: ["front", "rear"],
          additionalProperties: false,
          default: {
            front: PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA.default,
            rear: PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA.default
          }
        },
        wings: {
          ...PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA,
          description: "The crippled limb status of the wings"
        }
      },
      required: ["torso", "head", "legs", "wings"],
      additionalProperties: false,
      default: {
        torso: false,
        head: false,
        legs: {
          front: {
            left: false,
            right: false
          },
          rear: {
            left: false,
            right: false
          }
        },
        wings: {
          left: false,
          right: false
        }
      }
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

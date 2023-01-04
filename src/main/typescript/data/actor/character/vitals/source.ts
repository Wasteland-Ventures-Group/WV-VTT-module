import { z } from "zod";
import { RESOURCE_SOURCE_SCHEMA } from "../../../foundryCommon.js";
import { zObject } from "../../../common.js";

const PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA = zObject({
  /** The status of the left limb */
  left: z.boolean().default(false),

  /** The status of the right limb */
  right: z.boolean().default(false)
});

export const LEGS_CRIPPLED_STATUS = zObject({
  /** The status of the front legs */
  front: PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA.default({}),

  /** The status of the rear legs */
  rear: PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA.default({})
});

export const LIMBS_CRIPPLED_STATUS = zObject({
  /** The crippled limb status of the torso */
  torso: z.boolean().default(false),

  /** The crippled limb status of the head */
  head: z.boolean().default(false),

  /** The crippled limb status of the second head */
  secondHead: z.boolean().default(false),

  /** The crippled limb status of the legs */
  legs: LEGS_CRIPPLED_STATUS.default({}),

  /** The crippled limb status of the wings */
  wings: PAIRED_LIMB_CRIPPLED_STATUS_SCHEMA.default({})
});

export const VITALS_SOURCE_SCHEMA = zObject({
  /** The hit points of the character */
  hitPoints: RESOURCE_SOURCE_SCHEMA.default({ value: 15 }),

  /** The action points of the character */
  actionPoints: RESOURCE_SOURCE_SCHEMA.default({ value: 12 }),

  /** The insanity of the character */
  insanity: RESOURCE_SOURCE_SCHEMA.default({ value: 0 }),

  /** The strain of the character */
  strain: RESOURCE_SOURCE_SCHEMA.default({ value: 20 }),

  /** The absorbed dose of radiation of the character */
  radiationDose: z.number().default(0),

  /** The crippled status of the character's limbs */
  crippledLimbs: LIMBS_CRIPPLED_STATUS.default({})
});

export type VitalsSource = z.infer<typeof VITALS_SOURCE_SCHEMA>;

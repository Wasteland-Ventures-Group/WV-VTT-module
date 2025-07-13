import { RESOURCE_SCHEMA } from "../../../foundryCommon.js";

import fields = foundry.data.fields;

const PAIRED_CRIPPLED_LIMB_STATUS_SCHEME = {
  /** The status of the front legs */
  left: new fields.BooleanField({ initial: false, required: true, nullable: false }),
  /** The status of the rear legs */
  right: new fields.BooleanField({ initial: false, required: true, nullable: false }),
}

const LEGS_CRIPPLED_STATUS_SCHEME = {
  front: new fields.SchemaField(PAIRED_CRIPPLED_LIMB_STATUS_SCHEME, { initial: {}, nullable: false, required: true }),
  back: new fields.SchemaField(PAIRED_CRIPPLED_LIMB_STATUS_SCHEME, { initial: {}, nullable: false, required: true }),
}

const LIMBS_CRIPPLED_STATUS_SCHEME = {
  /** The crippled limb status of the torso */
  torso: new fields.BooleanField({ initial: false, required: true, nullable: false }),
  /** The crippled limb status of the head */
  head: new fields.BooleanField({ initial: false, required: true, nullable: false }),
  /** The crippled limb status of the second head */
  secondHead: new fields.BooleanField({ initial: false, required: true, nullable: false }),
  /** The crippled limb status of the legs */
  legs: new fields.SchemaField(LEGS_CRIPPLED_STATUS_SCHEME, { required: true, nullable: false, }),
  /** The crippled limb status of the wings */
  wings: new fields.SchemaField(PAIRED_CRIPPLED_LIMB_STATUS_SCHEME, { required: true, nullable: false })
}

// TODO? add defaults.
export const VITALS_SCHEME = {
  /** The hit points of the character */
  hitPoints: new fields.SchemaField(RESOURCE_SCHEMA, {
    initial: { value: 15 }
  }),

  /** The action points of the character */
  actionPoints: new fields.SchemaField(RESOURCE_SCHEMA, {
    initial: { value: 12 }
  }),

  /** The insanity of the character */
  insanity: new fields.SchemaField(RESOURCE_SCHEMA, {
    initial: { value: 0 }
  }),

  /** The strain of the character */
  strain: new fields.SchemaField(RESOURCE_SCHEMA, {
    initial: { value: 20 }
  }),

  /** The absorbed dose of radiation of the character */
  radiationDose: new fields.NumberField({ min: 0, initial: 0, integer: true }),

  /** The crippled status of the character's limbs */
  crippledLimbs: new fields.SchemaField(LIMBS_CRIPPLED_STATUS_SCHEME),
};


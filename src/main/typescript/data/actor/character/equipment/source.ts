import { z } from "zod";
import { zObject } from "../../../common.js";
import { ID_STRING, RESOURCE_SCHEMA } from "../../../foundryCommon.js";

export type EquipmentSource = z.infer<typeof EQUIPMENT_SCHEMA>;
export const EQUIPMENT_SCHEMA = zObject({
  /** The amount of caps the character owns */
  caps: z.number().default(0),

  /** The quick slot charges of the character */
  quickSlots: RESOURCE_SCHEMA.default({ value: 0 }),

  /** The ID of the readied item in the character's posession. */
  readiedItemId: ID_STRING.nullable().default(null),

  /**
   * The IDs of the weapon items in the character's posession in weapon slots.
   */
  weaponSlotIds: z
    .tuple([ID_STRING.nullable(), ID_STRING.nullable()])
    .default([null, null]),

  /** The ID of the equipped armor apparel in the character's posession */
  armorSlotId: ID_STRING.nullable().default(null),

  /** The ID of the equipped clothing apparel in the character's posession */
  clothingSlotId: ID_STRING.nullable().default(null),

  /** The ID of the equipped eyes apparel in the character's posession */
  eyesSlotId: ID_STRING.nullable().default(null),

  /** The ID of the equipped mouth apparel in the character's posession */
  mouthSlotId: ID_STRING.nullable().default(null),

  /** The ID of the equipped belt apparel in the character's posession */
  beltSlotId: ID_STRING.nullable().default(null)
});

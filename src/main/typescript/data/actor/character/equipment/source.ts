import { TypeOf, z } from "zod";
import { RESOURCE_SCHEMA } from "../../../foundryCommon";

export type EquipmentSource = z.infer<typeof EQUIPMENT_SCHEMA>;
export const EQUIPMENT_SCHEMA = z.object({
  /** The amount of caps the character owns */
  caps: z.number().default(0),

  /** The quick slot charges of the character */
  quickSlots: RESOURCE_SCHEMA.default({ value: 0 }),

  /** The ID of the readied item in the character's posession. */
  readiedItemId: z.string().nullable().default(null),

  /**
   * The IDs of the weapon items in the character's posession in weapon slots.
   */
  weaponSlotIds: z
    .tuple([z.string().nullable(), z.string().nullable()])
    .default([null, null]),

  /** The ID of the equipped armor apparel in the character's posession */
  armorSlotId: z.string().nullable().default(null),

  /** The ID of the equipped clothing apparel in the character's posession */
  clothingSlotId: z.string().nullable().default(null),

  /** The ID of the equipped eyes apparel in the character's posession */
  eyesSlotId: z.string().nullable().default(null),

  /** The ID of the equipped mouth apparel in the character's posession */
  mouthSlotId: z.string().nullable().default(null),

  /** The ID of the equipped belt apparel in the character's posession */
  beltSlotId: z.string().nullable().default(null)
});

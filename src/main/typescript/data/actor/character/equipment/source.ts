import { RESOURCE_FIELD, } from "../../../foundryCommon.js";

import fields = foundry.data.fields;


export const EQUIPMENT_SCHEMA = {
  /** The quick slot charges of the character */
  quickSlots: RESOURCE_FIELD,
  /** The ID of the readied item in the character's posession. */
  readiedItemId: new fields.DocumentIdField(),
  /** The ID of the equipped armor apparel in the character's posession */
  armorSlotId: new fields.DocumentIdField(),
  /** The ID of the equipped clothing apparel in the character's posession */
  clothingSlotId: new fields.DocumentIdField(),
  /** The ID of the equipped eyes apparel in the character's posession */
  eyesSlotId: new fields.DocumentIdField(),
  /** The ID of the equipped mouth apparel in the character's posession */
  mouthSlotId: new fields.DocumentIdField(),
  /** The ID of the equipped belt apparel in the character's posession */
  beltSlotId: new fields.DocumentIdField(),
  /**
   * The IDs of the weapon items in the character's posession in weapon slots.
   */
  weaponSlotIds: new fields.ArrayField(
    new fields.DocumentIdField({ required: true, nullable: false }),
    { min: 2, max: 2, required: true, nullable: false }
  ),
  /** The amount of caps the character owns */
  caps: new fields.NumberField(),
};

export type EquipmentSource = fields.SchemaField.InitializedData<typeof EQUIPMENT_SCHEMA>;

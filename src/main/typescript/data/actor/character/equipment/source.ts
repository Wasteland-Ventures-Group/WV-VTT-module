import type { JSONSchemaType } from "ajv";
import { Resource, RESOURCE_JSON_SCHEMA } from "../../../foundryCommon.js";

export default class EquipmentSource {
  /** The amount of caps the character owns */
  caps: number = 0;

  /** The quick slot charges of the character */
  quickSlots = new Resource(0);

  /** The ID of the readied item in the character's posession. */
  readiedItemId: string | null = null;

  /**
   * The IDs of the weapon items in the character's posession in weapon slots.
   */
  weaponSlotIds: [string | null, string | null] = [null, null];

  /** The ID of the equipped armor apparel in the character's posession */
  armorSlotId: string | null = null;

  /** The ID of the equipped clothing apparel in the character's posession */
  clothingSlotId: string | null = null;

  /** The ID of the equipped eyes apparel in the character's posession */
  eyesSlotId: string | null = null;

  /** The ID of the equipped mouth apparel in the character's posession */
  mouthSlotId: string | null = null;

  /** The ID of the equipped belt apparel in the character's posession */
  beltSlotId: string | null = null;
}

const ITEM_ID_SCHEMA = {
  type: "string",
  nullable: true,
  pattern: "^[a-zA-Z0-9]{16}$"
} as const;

export const EQUIPMENT_JSON_SCHEMA: JSONSchemaType<EquipmentSource> = {
  description: "An equipment specification",
  type: "object",
  properties: {
    caps: {
      description: "The amount of caps the actor owns",
      type: "integer",
      default: 0
    },
    quickSlots: RESOURCE_JSON_SCHEMA,
    readiedItemId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the readied item in the actor's posession. Can be null."
    },
    weaponSlotIds: {
      description:
        "The IDs of the weapons items in the actor's posession in weapon slots. They can be null.",
      type: "array",
      items: [ITEM_ID_SCHEMA, ITEM_ID_SCHEMA],
      minItems: 2,
      maxItems: 2
    },
    armorSlotId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the equipped armor apparel in the actor's posession. Can be null."
    },
    clothingSlotId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the equipped clothing apparel in the actor's posession. Can be null."
    },
    eyesSlotId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the equipped eyes apparel in the actor's posession. Can be null."
    },
    mouthSlotId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the equipped mouth apparel in the actor's posession. Can be null."
    },
    beltSlotId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the equipped belt apparel in the actor's posession. Can be null."
    }
  },
  required: [
    "caps",
    "quickSlots",
    "readiedItemId",
    "weaponSlotIds",
    "armorSlotId",
    "clothingSlotId",
    "eyesSlotId",
    "mouthSlotId",
    "beltSlotId"
  ],
  additionalProperties: false,
  default: {
    caps: 0
  }
};

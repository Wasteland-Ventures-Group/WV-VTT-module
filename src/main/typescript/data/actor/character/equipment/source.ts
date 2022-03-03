import type { JSONSchemaType } from "ajv";

/** An actor equipment object for the database */
export default class EquipmentSource {
  /** The amount of caps the actor owns */
  caps: number = 0;

  /** The ID of the readied item in the actor's posession. */
  readiedItemId: string | null = null;

  /** The IDs of the weapons items in the actor's posession in weapon slots. */
  weaponSlotIds: [string | null, string | null] = [null, null];
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
    readiedItemId: {
      ...ITEM_ID_SCHEMA,
      description:
        "The ID of the readied item in the actor's posession. Can be null."
    },
    weaponSlotIds: {
      description:
        "The IDs of the weapons items in the actor's posession in weapon slots.",
      type: "array",
      items: [ITEM_ID_SCHEMA, ITEM_ID_SCHEMA],
      minItems: 2,
      maxItems: 2
    }
  },
  required: ["caps", "readiedItemId", "weaponSlotIds"],
  additionalProperties: false,
  default: {
    caps: 0
  }
};

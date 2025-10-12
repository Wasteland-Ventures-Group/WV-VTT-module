import { STACKABLE_ITEM_SCHEMA } from "../common/stackableItem/source.js";
import fields = foundry.data.fields;

export const MISC_SCHEMA = STACKABLE_ITEM_SCHEMA;

export type MiscSource = fields.SchemaField.InitializedData<typeof MISC_SCHEMA>;

import fields = foundry.data.fields
import type { TARGET_SCHEMA } from "./source";

type TargetSource = fields.SchemaField.InitializedData<typeof TARGET_SCHEMA>;
export type TargetProperties = TargetSource;


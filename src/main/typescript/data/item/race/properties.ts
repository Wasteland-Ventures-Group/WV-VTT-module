import type WvItem from "../../../item/wvItem.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import fields = foundry.data.fields;
import type { RACE_SCHEMA } from "./source.js";
type RaceSource = fields.SchemaField.InitializedData<typeof RACE_SCHEMA>;

export type RaceProperties = RaceSource & BaseItemProperties;

export namespace RaceProperties {
  export function from(s: RaceSource, owningItem: WvItem) {
    return {
      ...BaseItemProperties.from(s, owningItem),
      ...s
    }
  }
}

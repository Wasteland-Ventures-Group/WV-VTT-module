import { BaseItemProperties } from "../common/baseItem/properties.js";
import { EFFECT_SCHEMA, } from "./source.js";
import fields = foundry.data.fields;
import type WvItem from "../../../item/wvItem.js";

export type EffectSource = fields.SchemaField.InitializedData<typeof EFFECT_SCHEMA>;

export type EffectProperties = EffectSource & BaseItemProperties;

export namespace EffectProperties {
  export function from(s: EffectSource, owningItem: WvItem): EffectProperties {
    return BaseItemProperties.from(s, owningItem);
  }
}

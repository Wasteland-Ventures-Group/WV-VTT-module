import type WvItem from "../../../item/wvItem.js";
import { StackableItemProperties } from "../common/stackableItem/properties.js";
import { type AmmoSource } from "./source.js";

export type AmmoProperties = AmmoSource & StackableItemProperties;

export namespace AmmoProperties {
  export function from(s: AmmoSource, owningItem: WvItem): AmmoProperties {
    const base = StackableItemProperties.from(s, owningItem);
    return { ...s, ...base }
  }
}

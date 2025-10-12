import type WvItem from "../../../item/wvItem.js";
import { StackableItemProperties } from "../common/stackableItem/properties.js";
import { type MiscSource } from "./source.js";

export type MiscProperties = MiscSource & StackableItemProperties;

export namespace MiscProperties {
  export function from(s: MiscSource, owningItem: WvItem) {
    return StackableItemProperties.from(s, owningItem)
  }
}

import type WvItem from "../../../item/wvItem.js";
import { BaseItemProperties } from "../common/baseItem/properties.js";
import { type RaceSource } from "./source.js";

export type RaceProperties = RaceSource & BaseItemProperties;

export namespace RaceProperties {
  export function from(s: RaceSource, owningItem: WvItem) {
    return {
      ...BaseItemProperties.from(s, owningItem),
      ...s
    }
  }
}

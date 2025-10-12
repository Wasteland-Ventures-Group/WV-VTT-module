import {
  defaultMagicSpecial,
  type GeneralMagicSchool,
  GeneralMagicSchools,
  type SpecialName
} from "../../../../constants";
import type WvItem from "../../../../item/wvItem";
import { BaseItemProperties } from "../../../item/common/baseItem/properties";
import { type MagicSource } from "./source";
export type MagicProperties = MagicSource & BaseItemProperties;

export namespace MagicProperties {
  export function from(source: MagicSource, owningItem: WvItem): MagicProperties {
    const magicSpecials = defaultMagicSpecial();
    GeneralMagicSchools.forEach((school) => {
      const sourceMagicSpecials = source.magicSpecials as Record<GeneralMagicSchool, SpecialName>;
      const specialOverride = sourceMagicSpecials[school];
      if (specialOverride !== undefined) {
        magicSpecials[school] = specialOverride;
      }
    });
    return { ...source, ...BaseItemProperties.from(source, owningItem), magicSpecials: magicSpecials }
  }
}

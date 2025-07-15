import {
  defaultMagicSpecial,
  type GeneralMagicSchool,
  GeneralMagicSchools,
  type SpecialName
} from "../../../../constants";
import { type MagicSource } from "./source";

export interface MagicProperties extends MagicSource {
  magicSpecials: Record<GeneralMagicSchool, SpecialName>,
}

export namespace MagicProperties {
  export function from(source: MagicSource): MagicProperties {
    const magicSpecials = defaultMagicSpecial();
    GeneralMagicSchools.forEach((school) => {
      const sourceMagicSpecials = source.magicSpecials as Record<GeneralMagicSchool, SpecialName>;
      const specialOverride = sourceMagicSpecials[school];
      if (specialOverride !== undefined) {
        magicSpecials[school] = specialOverride;
      }
    });
    return { ...source, magicSpecials: magicSpecials }
  }
}

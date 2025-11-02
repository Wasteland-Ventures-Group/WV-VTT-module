import {
  defaultMagicSpecial,
  type GeneralMagicSchool,
  GeneralMagicSchools,
  type SpecialName
} from "../../../../constants";
import { type MagicSource } from "./source";
export type CharacterMagicProperties = MagicSource;

export namespace CharacterMagicProperties {
  export function from(source: MagicSource): CharacterMagicProperties {
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

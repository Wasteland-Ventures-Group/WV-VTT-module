import {
  defaultMagicSpecial,
  GeneralMagicSchool,
  GeneralMagicSchools,
  SpecialName
} from "../../../../constants";
import MagicSource from "./source";

export default class MagicProperties extends MagicSource {
  constructor(source: MagicSource) {
    super();
    foundry.utils.mergeObject(this, source);

    this.magicSpecials = defaultMagicSpecial();
    GeneralMagicSchools.forEach((school) => {
      const specialOverride = source.magicSpecials[school];
      if (specialOverride !== undefined) {
        this.magicSpecials[school] = specialOverride;
      }
    });
  }

  magicSpecials: Record<GeneralMagicSchool, SpecialName>;
}

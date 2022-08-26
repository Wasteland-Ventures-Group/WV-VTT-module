import {
  defaultMagicSpecial,
  GeneralMagicSchool,
  SpecialName
} from "../../../../constants";
import MagicSource from "./source";

export default class MagicProperties extends MagicSource {
  constructor(source: MagicSource) {
    super();
    foundry.utils.mergeObject(this, source);

    this.magicSpecials = defaultMagicSpecial();
    foundry.utils.mergeObject(this.magicSpecials, source.magicSpecials);
  }

  magicSpecials: Record<GeneralMagicSchool, SpecialName>;
}

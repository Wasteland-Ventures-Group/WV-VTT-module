import {
  CONSTANTS,
  SkillName,
  ThaumaturgySpecial
} from "../../../../constants.js";
import { CompositeNumber } from "../../../common.js";
import type LevelingProperties from "../leveling/properties.js";
import type SpecialsProperties from "../../common/specials/properties.js";
import BaseSkillsProperties from "../../common/skills/properties.js";

export default class SkillsProperties extends BaseSkillsProperties {
  override computeBaseSkill(
    skill: SkillName,
    specials: SpecialsProperties,
    thaumSpecial: ThaumaturgySpecial,
    leveling: LevelingProperties
  ): CompositeNumber {
    const baseSkill =
      specials[
        skill === "thaumaturgy" ? thaumSpecial : CONSTANTS.skillSpecials[skill]
      ].permTotal *
        2 +
      Math.floor(specials.luck.permTotal / 2);
    const composite = new CompositeNumber(baseSkill, { min: 0, max: 85 });
    composite.add({
      value: leveling.skillRanks[skill],
      labelComponents: [{ key: "wv.rules.skills.points.short" }]
    });
    return composite;
  }
}

import {
  CONSTANTS,
  SkillName,
  ThaumaturgySpecial
} from "../../../../constants.js";
import { CompositeNumber } from "../../../common.js";
import type LevelingProperties from "../leveling/properties.js";
import type SpecialsProperties from "../specials/properties.js";

export default class SkillsProperties
  implements Record<SkillName, CompositeNumber>
{
  /** The Barter skill of the character */
  barter = new CompositeNumber();

  /** The Diplomacy skill of the character */
  diplomacy = new CompositeNumber();

  /** The Explosives skill of the character */
  explosives = new CompositeNumber();

  /** The Firearms skill of the character */
  firearms = new CompositeNumber();

  /** The Intimidation skill of the character */
  intimidation = new CompositeNumber();

  /** The Lockpick skill of the character */
  lockpick = new CompositeNumber();

  /** The Magical Energy Weapons skill of the character */
  magicalEnergyWeapons = new CompositeNumber();

  /** The Mechanics skill of the character */
  mechanics = new CompositeNumber();

  /** The Medicine skill of the character */
  medicine = new CompositeNumber();

  /** The Melee skill of the character */
  melee = new CompositeNumber();

  /** The Science skill of the character */
  science = new CompositeNumber();

  /** The Sleight skill of the character */
  sleight = new CompositeNumber();

  /** The Sneak skill of the character */
  sneak = new CompositeNumber();

  /** The Survival skill of the character */
  survival = new CompositeNumber();

  /** The Thaumaturgy skill of the character */
  thaumaturgy = new CompositeNumber();

  /** The Unarmed skill of the character */
  unarmed = new CompositeNumber();

  /** Set the base values and skill points for all skills. */
  setBaseValues(
    specials: SpecialsProperties,
    thaumSpecial: ThaumaturgySpecial,
    leveling: LevelingProperties
  ) {
    let skill: SkillName;
    for (skill in CONSTANTS.skillSpecials) {
      this[skill] = this.computeBaseSkill(
        skill,
        specials,
        thaumSpecial,
        leveling
      );
    }
    this["thaumaturgy"] = this.computeBaseSkill(
      "thaumaturgy",
      specials,
      thaumSpecial,
      leveling
    );
  }

  private computeBaseSkill(
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
    const composite = new CompositeNumber(baseSkill);
    composite.add({
      value: leveling.skillRanks[skill],
      labelComponents: [{ key: "wv.rules.skills.points.short" }]
    });
    return composite;
  }
}

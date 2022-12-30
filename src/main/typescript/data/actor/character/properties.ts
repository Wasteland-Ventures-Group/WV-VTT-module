import { CONSTANTS, SpecialNames, TYPES } from "../../../constants.js";
import { CompositeNumber } from "../../common.js";
import { BackgroundProperties } from "./background/properties.js";
import { EquipmentProperties } from "./equipment/properties.js";
import type { LevelingProperties } from "./leveling/properties.js";
import { MagicProperties } from "./magic/properties.js";
import SkillsProperties from "./skills/properties.js";
import type { CharacterDataSourceData } from "./source.js";
import { SpecialsProperties, Special } from "./specials/properties.js";
import { VitalsProperties } from "./vitals/properties.js";

export default interface CharacterDataProperties {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataPropertiesData;
}

export class ResistancesProperties {
  /** The poison resistance of the character */
  poison = new CompositeNumber(10);

  /** The radiation resistance of the character */
  radiation = new CompositeNumber(5);
}

export class CriticalsProperties {
  /** The critical failure chance of the character */
  failure = new CompositeNumber(100);

  /** The critical success chance of the character */
  success = new CompositeNumber(1);

  /** Apply Luck and set the base values for the crit chances. */
  applyLuck(luck: Special) {
    this.success.source = Math.max(1, luck.tempTotal);
    this.failure.source = Math.min(100, 90 + luck.tempTotal);
  }
}

export class AttackActionModifierProperties {
  constructor(apCost: number, rollMod: number) {
    this.apCost = new CompositeNumber(apCost);
    this.rollMod = new CompositeNumber(rollMod);
  }

  /** How much this action modifies the attack's AP cost */
  apCost: CompositeNumber;

  /**
   * How much this action modifies the attack's roll. This can either modify
   * crit chance or hit chance.
   */
  rollMod: CompositeNumber;
}

const attackMods = CONSTANTS.rules.actions.attack;

export class SecondaryStatisticsProperties {
  /** The criticals of the character */
  criticals = new CriticalsProperties();

  /** The fixed part of the initiative formula. */
  initiative = new CompositeNumber();

  /** The maximum carry weight of the character in kg */
  maxCarryWeight = new CompositeNumber();

  /** The modifier for sneak attacks */
  sneakAttackMod = new AttackActionModifierProperties(
    attackMods.sneak.apCost,
    attackMods.sneak.criticalHitBonus
  );

  /** The modifier for aimed shots */
  aimMod = new AttackActionModifierProperties(
    attackMods.aim.apCost,
    attackMods.aim.rollBonus
  );

  /** The modifier for called shots */
  calledShotMod = new CompositeNumber(attackMods.called.apCost);

  /** Apply Strength and set the base value for carry weight. */
  applySpecials(specials: SpecialsProperties) {
    this.criticals.applyLuck(specials.luck);
    this.initiative.source = specials.perception.tempTotal;
    this.maxCarryWeight.source = specials.strength.tempTotal * 5 + 10;
  }

  /** Apply the size category to the max carry weight. */
  applySizeCategory(sizeCategory: number) {
    const value = {
      4: 60,
      3: 40,
      2: 10,
      1: 5,
      [-1]: -5,
      [-2]: -10,
      [-3]: -40,
      [-4]: -60
    }[sizeCategory];

    if (value)
      this.maxCarryWeight.add({
        value,
        labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
      });
  }
}

export type CharacterDataPropertiesData = CharacterDataSourceData & {
  background: BackgroundProperties;

  equipment: EquipmentProperties;

  leveling: LevelingProperties;

  vitals: VitalsProperties;

  magic: MagicProperties;

  /** The secondary statistics of the character */
  secondary: SecondaryStatisticsProperties;

  /** The resistances of the character */
  resistances: ResistancesProperties;

  /** The skills of the character */
  skills: SkillsProperties;

  /** The SPECIALs of the character */
  specials: SpecialsProperties;
};

export const CharacterDataPropertiesData = {
  from(source: CharacterDataSourceData): CharacterDataPropertiesData {
    const leveling = deepClone(source.leveling);
    const specials = SpecialsProperties.from();

    for (const specialName of SpecialNames) {
      const special = specials[specialName];
      special.points = leveling.specialPoints[specialName];
      special.permBounds = { min: 0, max: 15 };
      special.tempBounds = { min: 0, max: 15 };
    }

    const background = BackgroundProperties.from(source.background);
    const equipment = EquipmentProperties.from(source.equipment);
    const vitals = VitalsProperties.from(source.vitals);
    const magic = MagicProperties.from(source.magic);
    const secondary = new SecondaryStatisticsProperties();
    const resistances = new ResistancesProperties();
    const skills = new SkillsProperties();
    return {
      ...source,
      background,
      equipment,
      vitals,
      magic,
      secondary,
      skills,
      specials,
      resistances
    };
  }
};

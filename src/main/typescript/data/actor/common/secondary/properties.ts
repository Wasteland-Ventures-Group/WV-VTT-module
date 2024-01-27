import { CONSTANTS } from "../../../../constants";
import { CompositeNumber } from "../../../common";
import type SpecialsProperties from "../specials/properties";
import type { Special } from "../specials/properties";

export default class SecondaryStatisticsProperties {
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

const attackMods = CONSTANTS.rules.actions.attack;
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

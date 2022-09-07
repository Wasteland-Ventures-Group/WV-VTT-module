import {
  getPainThreshold,
  PainThreshold,
  RadiationSicknessLevel
} from "../../../../constants.js";
import WvI18n from "../../../../wvI18n.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import type SpecialsProperties from "../specials/properties.js";
import VitalsSource from "./source.js";

export default class VitalsProperties extends VitalsSource {
  constructor(source: VitalsSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.hitPoints = CompositeResource.from(source.hitPoints);
    this.painThreshold = getPainThreshold(this.hitPoints.value);
    this.actionPoints = CompositeResource.from(source.actionPoints);
    this.insanity = CompositeResource.from(source.insanity);
    this.strain = CompositeResource.from(source.strain);
  }

  painThreshold: PainThreshold;

  override hitPoints: CompositeResource;

  override actionPoints: CompositeResource;

  override insanity: CompositeResource;

  override strain: CompositeResource;

  /** The healing rate of the character per 8 hours of rest */
  healingRate = new CompositeNumber();

  /** Get the amount of crippled legs. */
  get crippledLegs(): number {
    return [
      this.crippledLimbs.legs.front.left,
      this.crippledLimbs.legs.front.right,
      this.crippledLimbs.legs.rear.left,
      this.crippledLimbs.legs.rear.right
    ].filter(Boolean).length;
  }

  /**
   * Get the internationalized name for the radiation sickness level of a
   * character.
   */
  get i18nRadiationSicknessLevel(): string {
    return WvI18n.radiationSicknessLevels[this.radiationSicknessLevel];
  }

  /** Get the level of radiation sickness. */
  get radiationSicknessLevel(): RadiationSicknessLevel {
    if (this.radiationDose >= 17) return "critical";
    if (this.radiationDose >= 13) return "major";
    if (this.radiationDose >= 9) return "moderate";
    if (this.radiationDose >= 5) return "minor";
    return "none";
  }

  /** Apply SPECIALs to the vitals and set the base values. */
  applySpecials(specials: SpecialsProperties) {
    this.hitPoints.source = specials.endurance.permTotal + 10;

    if (specials.endurance.tempTotal >= 8) {
      this.healingRate.source = 3;
    } else if (specials.endurance.tempTotal >= 4) {
      this.healingRate.source = 2;
    } else {
      this.healingRate.source = 1;
    }

    this.actionPoints.source = Math.floor(specials.agility.tempTotal / 2) + 10;
    this.insanity.source = Math.floor(specials.intelligence.tempTotal / 2) + 5;
  }

  /** Apply the level to the vitals and set the base strain. */
  applyLevel(level: number) {
    this.strain.source = 20 + Math.floor(level / 5) * 5;
  }

  /** Apply the size category and set a hit points modifier. */
  applySizeCategory(sizeCategory: number) {
    const value = {
      4: 4,
      3: 2,
      2: 1,
      [-2]: -1,
      [-3]: -2,
      [-4]: -4
    }[sizeCategory];

    if (value)
      this.hitPoints.add({
        value,
        labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
      });
  }
}

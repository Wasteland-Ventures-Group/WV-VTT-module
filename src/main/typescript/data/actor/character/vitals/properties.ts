import {
  getPainThreshold,
  PainThreshold,
  RadiationSicknessLevel
} from "../../../../constants.js";
import WvI18n from "../../../../wvI18n.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import type { SpecialsProperties } from "../specials/properties.js";
import type { VitalsSource } from "./source.js";

export type VitalsProperties = VitalsSource & {
  /** Indicates the character's pain threshold */
  painThreshold: PainThreshold;

  hitPoints: CompositeResource;

  actionPoints: CompositeResource;

  insanity: CompositeResource;

  strain: CompositeResource;

  /** The healing rate of the character per 8 hours of rest */
  healingRate: CompositeNumber;
};

export const VitalsProperties = {
  from(source: VitalsSource): VitalsProperties {
    const hitPoints = CompositeResource.from(source.hitPoints);
    hitPoints.bounds.min = 0;

    const painThreshold = getPainThreshold(hitPoints.value);

    const actionPoints = CompositeResource.from(source.actionPoints);
    actionPoints.bounds.min = 0;

    const insanity = CompositeResource.from(source.insanity);
    insanity.bounds.min = 0;

    const strain = CompositeResource.from(source.strain);
    strain.bounds.min = 0;

    const healingRate = CompositeNumber.from({ source: 0, bounds: { min: 0 } });
    return {
      ...source,
      hitPoints,
      painThreshold,
      actionPoints,
      insanity,
      strain,
      healingRate
    };
  },

  /** Get the amount of crippled legs. */
  crippledLegs(vitals: VitalsProperties): number {
    return [
      vitals.crippledLimbs.legs.front.left,
      vitals.crippledLimbs.legs.front.right,
      vitals.crippledLimbs.legs.rear.left,
      vitals.crippledLimbs.legs.rear.right
    ].filter(Boolean).length;
  },

  /**
   * Get the internationalized name for the radiation sickness level of a
   * character.
   */
  i18nRadiationSicknessLevel(vitals: VitalsProperties): string {
    const radSickLev = this.radiationSicknessLevel(vitals);
    return WvI18n.radiationSicknessLevels[radSickLev];
  },

  /** Get the level of radiation sickness. */
  radiationSicknessLevel(vitals: VitalsProperties): RadiationSicknessLevel {
    if (vitals.radiationDose >= 17) return "critical";
    if (vitals.radiationDose >= 13) return "major";
    if (vitals.radiationDose >= 9) return "moderate";
    if (vitals.radiationDose >= 5) return "minor";
    return "none";
  },

  /** Apply SPECIALs to the vitals and set the base values. */
  applySpecials(vitals: VitalsProperties, specials: SpecialsProperties) {
    vitals.hitPoints.source = specials.endurance.permTotal + 10;

    if (specials.endurance.tempTotal >= 8) {
      vitals.healingRate.source = 3;
    } else if (specials.endurance.tempTotal >= 4) {
      vitals.healingRate.source = 2;
    } else {
      vitals.healingRate.source = 1;
    }

    vitals.actionPoints.source =
      Math.floor(specials.agility.tempTotal / 2) + 10;
    vitals.insanity.source =
      Math.floor(specials.intelligence.tempTotal / 2) + 5;
  },

  /** Apply the level to the vitals and set the base strain. */
  applyLevel(vitals: VitalsProperties, level: number) {
    vitals.strain.source = 20 + Math.floor(level / 5) * 5;
  },

  /** Apply the size category and set a hit points modifier. */
  applySizeCategory(vitals: VitalsProperties, sizeCategory: number) {
    const value = {
      4: 4,
      3: 2,
      2: 1,
      [-2]: -1,
      [-3]: -2,
      [-4]: -4
    }[sizeCategory];

    if (value)
      vitals.hitPoints.add({
        value,
        labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
      });
  }
};

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

  /** Get the amount of crippled legs. */
  readonly crippledLegs: number;

  /** Get the level of radiation sickness. */
  readonly radiationSicknessLevel: RadiationSicknessLevel;

  /**
   * Get the internationalized name for the radiation sickness level of a
   * character.
   */

  readonly i18nRadiationSicknessLevel: string;
  /** Apply SPECIALs to the vitals and set the base values. */
  applySpecials(specials: SpecialsProperties): void;

  /** Apply the level to the vitals and set the base strain. */
  applyLevel(level: number): void;

  /** Apply the size category and set a hit points modifier. */
  applySizeCategory(sizeCategory: number): void;
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
      healingRate,

      get crippledLegs() {
        return [
          this.crippledLimbs.legs.front.left,
          this.crippledLimbs.legs.front.right,
          this.crippledLimbs.legs.rear.left,
          this.crippledLimbs.legs.rear.right
        ].filter(Boolean).length;
      },

      get i18nRadiationSicknessLevel() {
        const radSickLev = this.radiationSicknessLevel;
        return WvI18n.radiationSicknessLevels[radSickLev];
      },

      get radiationSicknessLevel() {
        if (this.radiationDose >= 17) return "critical";
        if (this.radiationDose >= 13) return "major";
        if (this.radiationDose >= 9) return "moderate";
        if (this.radiationDose >= 5) return "minor";
        return "none";
      },

      applySpecials: function (specials: SpecialsProperties) {
        this.hitPoints.source = specials.endurance.permTotal + 10;

        if (specials.endurance.tempTotal >= 8) {
          this.healingRate.source = 3;
        } else if (specials.endurance.tempTotal >= 4) {
          this.healingRate.source = 2;
        } else {
          this.healingRate.source = 1;
        }

        this.actionPoints.source =
          Math.floor(specials.agility.tempTotal / 2) + 10;
        this.insanity.source =
          Math.floor(specials.intelligence.tempTotal / 2) + 5;
      },

      applyLevel(level: number) {
        this.strain.source = 20 + Math.floor(level / 5) * 5;
      },

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
    };
  }
};

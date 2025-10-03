import {
  getPainThreshold,
  type PainThreshold,
  type RadiationSicknessLevel
} from "../../../../constants.js";
import WvI18n from "../../../../wvI18n.js";
import { CompositeNumber, CompositeResource } from "../../../common.js";
import type SpecialsProperties from "../specials/properties.js";
import { type VitalsSource } from "./source.js";

export type VitalsProperties = VitalsSource & {
  hitPoints: CompositeResource;
  /** The healing rate of the character per 8 hours of rest */
  healingRate: CompositeNumber;
  actionPoints: CompositeResource;
  insanity: CompositeResource;
  strain: CompositeResource;
  painThreshold: PainThreshold;
};

export namespace VitalsProperties {
  export function from(v: VitalsSource): VitalsProperties {
    return {
      ...v,
      hitPoints: CompositeResource.from(v.hitPoints),
      actionPoints: CompositeResource.from(v.actionPoints),
      healingRate: new CompositeNumber(0, { min: 0 }),
      strain: CompositeResource.from(v.strain),
      insanity: CompositeResource.from(v.insanity),
      painThreshold: getPainThreshold(v.hitPoints.value),
    }
  }

  /** Apply SPECIALs to the vitals and set the base values. */
  export function applySpecials(self: VitalsProperties, specials: SpecialsProperties) {
    self.hitPoints.source = specials.endurance.permTotal + 10;

    if (specials.endurance.tempTotal >= 8) {
      self.healingRate.source = 3;
    } else if (specials.endurance.tempTotal >= 4) {
      self.healingRate.source = 2;
    } else {
      self.healingRate.source = 1;
    }

    self.actionPoints.source = Math.floor(specials.agility.tempTotal / 2) + 10;
    self.insanity.source = Math.floor(specials.intelligence.tempTotal / 2) + 5;
  }

  /** Apply the level to the vitals and set the base strain. */
  export function applyLevel(self: VitalsProperties, level: number) {
    self.strain.source = 20 + Math.floor(level / 5) * 5;
  }

  /** Apply the size category and set a hit points modifier. */
  export function applySizeCategory(self: VitalsProperties, sizeCategory: number) {
    const value = {
      4: 4,
      3: 2,
      2: 1,
      [-2]: -1,
      [-3]: -2,
      [-4]: -4
    }[sizeCategory];

    if (value)
      self.hitPoints.add({
        value,
        labelComponents: [{ key: "wv.rules.background.sizeCategory" }]
      });
  }

  /** Get the amount of crippled legs. */
  export function crippledLegs(self: VitalsProperties): number {
    return [
      self.crippledLimbs.legs.front.left,
      self.crippledLimbs.legs.front.right,
      self.crippledLimbs.legs.rear.left,
      self.crippledLimbs.legs.rear.right
    ].filter(Boolean).length;
  }

  /** Get the level of radiation sickness. */
  export function radiationSicknessLevel(self: VitalsProperties): RadiationSicknessLevel {
    if (self.radiationDose >= 17) return "critical";
    if (self.radiationDose >= 13) return "major";
    if (self.radiationDose >= 9) return "moderate";
    if (self.radiationDose >= 5) return "minor";
    return "none";
  }

  /**
   * Get the internationalized name for the radiation sickness level of a
   * character.
   */
  export function i18nRadiationSicknessLevel(self: VitalsProperties): string {
    return WvI18n.radiationSicknessLevels[radiationSicknessLevel(self)];
  }
}

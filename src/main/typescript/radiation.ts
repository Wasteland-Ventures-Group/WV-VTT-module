import type WvActor from "./actor/wvActor.js";
import type { LabelComponent } from "./data/common.js";
import WvI18n from "./wvI18n.js";

/** Apply radiation sickness effects to an actor based on its absorbed dose. */
export function applyRadiationSickness(actor: WvActor) {
  const sicknessLevel = getRadiationSicknessLevel(
    actor.data.data.vitals.radiationDose
  );
  const labelComponents: LabelComponent[] = [
    { key: "wv.rules.radiation.name" }
  ];

  switch (sicknessLevel) {
    case "none":
      return;
    case "minor":
      actor.data.data.specials.endurance.addTemp({
        value: -1,
        labelComponents
      });
      return;
    case "moderate":
      actor.data.data.specials.endurance.addTemp({
        value: -2,
        labelComponents
      });
      actor.data.data.specials.agility.addTemp({ value: -1, labelComponents });
      return;
    case "major":
      actor.data.data.specials.endurance.addTemp({
        value: -3,
        labelComponents
      });
      actor.data.data.specials.agility.addTemp({ value: -2, labelComponents });
      actor.data.data.specials.strength.addTemp({ value: -1, labelComponents });
      return;
    case "critical":
      actor.data.data.specials.endurance.addTemp({
        value: -3,
        labelComponents
      });
      actor.data.data.specials.agility.addTemp({ value: -3, labelComponents });
      actor.data.data.specials.strength.addTemp({ value: -2, labelComponents });
      return;
  }
}

/**
 * Get the internationalized name for the radiation sickness level of an actor.
 */
export function getI18nRadiationSicknessLevel(actor: WvActor): string {
  return WvI18n.radiationSicknessLevels[
    getRadiationSicknessLevel(actor.data.data.vitals.radiationDose)
  ];
}

/** The type for radiation sickness levels */
export type RadiationSicknessLevel = typeof RadiationSicknessLevels[number];
/** Levels of radiation sickness */
export const RadiationSicknessLevels = [
  "none",
  "minor",
  "moderate",
  "major",
  "critical"
] as const;

/**
 * Get the level of radiation sickness.
 *
 * @param radiation - the amount of radiation to get the sickness level for
 */
function getRadiationSicknessLevel(radiation: number): RadiationSicknessLevel {
  if (radiation >= 17) return "critical";
  if (radiation >= 13) return "major";
  if (radiation >= 9) return "moderate";
  if (radiation >= 5) return "minor";
  return "none";
}

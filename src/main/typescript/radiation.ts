import type WvActor from "./actor/wvActor.js";
import WvI18n from "./wvI18n.js";

/** Apply radiation sickness effects to an actor based on its absorbed dose. */
export function applyRadiationSickness(actor: WvActor) {
  const sicknessLevel = getRadiationSicknessLevel(
    actor.data.data.vitals.radiationDose
  );

  switch (sicknessLevel) {
    case "none":
      return;
    case "minor":
      if (actor.data.data.specials.endurance)
        actor.data.data.specials.endurance.tempTotal -= 1;
      return;
    case "moderate":
      if (actor.data.data.specials.endurance)
        actor.data.data.specials.endurance.tempTotal -= 2;
      if (actor.data.data.specials.agility)
        actor.data.data.specials.agility.tempTotal -= 1;
      return;
    case "major":
      if (actor.data.data.specials.endurance)
        actor.data.data.specials.endurance.tempTotal -= 3;
      if (actor.data.data.specials.agility)
        actor.data.data.specials.agility.tempTotal -= 2;
      if (actor.data.data.specials.strength)
        actor.data.data.specials.strength.tempTotal -= 1;
      return;
    case "critical":
      if (actor.data.data.specials.endurance)
        actor.data.data.specials.endurance.tempTotal -= 3;
      if (actor.data.data.specials.agility)
        actor.data.data.specials.agility.tempTotal -= 3;
      if (actor.data.data.specials.strength)
        actor.data.data.specials.strength.tempTotal -= 2;
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

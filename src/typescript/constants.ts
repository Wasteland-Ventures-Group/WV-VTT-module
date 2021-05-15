export type SpecialNames = typeof SpecialNames[number];
export const SpecialNames = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
] as const;

export type ThaumaturgySpecials = Exclude<SpecialNames, "luck">;
export const ThaumaturgySpecials = SpecialNames.filter(
  (special) => special !== "luck"
) as ThaumaturgySpecials[];

export type SkillNames = typeof SkillNames[number];
export const SkillNames = [
  "barter",
  "diplomacy",
  "explosives",
  "firearms",
  "intimidation",
  "lockpick",
  "magicalEnergyWeapons",
  "mechanics",
  "medicine",
  "melee",
  "science",
  "sleight",
  "sneak",
  "survival",
  "thaumaturgy",
  "unarmed"
] as const;

/** This object holds common constants for the Wasteland Ventures system. */
export const CONSTANTS = {
  skillSpecials: {
    barter: "charisma",
    diplomacy: "charisma",
    explosives: "perception",
    firearms: "agility",
    intimidation: "strength",
    lockpick: "perception",
    magicalEnergyWeapons: "perception",
    mechanics: "intelligence",
    medicine: "intelligence",
    melee: "strength",
    science: "intelligence",
    sleight: "agility",
    sneak: "agility",
    survival: "endurance",
    unarmed: "endurance"
  } as Record<SkillNames, SpecialNames>,

  systemId: "wasteland-ventures",

  /**
   * This is the path for the system directory in Foundry's global working
   * directory.
   */
  systemPath: "systems/wasteland-ventures"
};

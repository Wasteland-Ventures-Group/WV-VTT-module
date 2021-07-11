import { SkillNames, SpecialNames } from "./constants.js";

/**
 * A custom typeguard to check whether a string is a valid SPECIAL name
 * @param name - the string to test
 * @returns whether the name is a SPECIAL name
 */
export function isSpecialName(name: string): name is SpecialNames {
  return SpecialNames.includes(name as SpecialNames);
}

/**
 * A custom typeguard to check whether a string is a valid Skill name
 * @param name - the string to test
 * @returns whether the name is a Skill name
 */
export function isSkillName(name: string): name is SkillNames {
  return SkillNames.includes(name as SkillNames);
}

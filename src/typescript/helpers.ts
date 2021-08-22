import { TYPE_CONSTRUCTORS } from "./typeMappings.js";
import { SkillNames, SpecialNames } from "./constants.js";

/**
 * A custom typeguard to check whether a value is not null or undefined.
 * @param value - the value to check
 * @returns whether the value is present
 */
export function present<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

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

/**
 * A custom typeguard to check whether a string is a mapped type identifier.
 * @param type - the type name to check
 * @returns whether the type name is mapped
 */
export function isMappedItemType(
  type: string
): type is keyof typeof TYPE_CONSTRUCTORS.ITEM {
  return Object.keys(TYPE_CONSTRUCTORS.ITEM).includes(type);
}

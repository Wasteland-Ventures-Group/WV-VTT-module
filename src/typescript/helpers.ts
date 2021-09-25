import { TYPE_CONSTRUCTORS } from "./typeMappings.js";
import { CONSTANTS, SkillNames, SpecialNames } from "./constants.js";
import { getGame } from "./foundryHelpers.js";
import { boundsSettingNames } from "./settings.js";

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

/**
 * A custom typeguard to check whether an Item is of the type, mapped from the
 * type name.
 * @param item - the item to check
 * @param type - the type name to check
 * @returns whether the Item is of the mapped type
 */
export function isOfItemType<T extends keyof typeof TYPE_CONSTRUCTORS.ITEM>(
  item: Item,
  type: T
): item is InstanceType<typeof TYPE_CONSTRUCTORS.ITEM[T]> {
  return item instanceof TYPE_CONSTRUCTORS.ITEM[type];
}

/** Get the allowed maximum value for a Special. */
export function getSpecialMaxPoints(): number {
  return CONSTANTS.bounds.special.points.max;
}

/** Get the allowed minimum value for a Special. */
export function getSpecialMinPoints(): number {
  const specialMin = getGame().settings.get(
    CONSTANTS.systemId,
    boundsSettingNames.special.points.min
  );
  return typeof specialMin === "number"
    ? specialMin
    : CONSTANTS.bounds.special.points.min;
}

/** Get the allowed maximum value for a Skill. */
export function getSkillMaxPoints(): number {
  return CONSTANTS.bounds.skills.points.max;
}

/** Get the allowed minimum value for a Skill. */
export function getSkillMinPoints(): number {
  const skillMin = getGame().settings.get(
    CONSTANTS.systemId,
    boundsSettingNames.skills.points.min
  );
  return typeof skillMin === "number"
    ? skillMin
    : CONSTANTS.bounds.skills.points.min;
}

import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";
import { boundsSettingNames } from "./settings.js";
import { TYPE_CONSTRUCTORS } from "./typeMappings.js";

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
  return getGame().settings.get(
    CONSTANTS.systemId,
    boundsSettingNames.special.points.min
  );
}

/** Get the allowed maximum value for a Skill. */
export function getSkillMaxPoints(): number {
  return CONSTANTS.bounds.skills.points.max;
}

/** Get the allowed minimum value for a Skill. */
export function getSkillMinPoints(): number {
  return getGame().settings.get(
    CONSTANTS.systemId,
    boundsSettingNames.skills.points.min
  );
}

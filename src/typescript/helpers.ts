import { TYPE_CONSTRUCTORS } from "./typeMappings.js";
import {
  CONSTANTS,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames
} from "./constants.js";
import { getGame } from "./foundryHelpers.js";
import { boundsSettingNames } from "./settings.js";
import type WvActor from "./actor/wvActor.js";

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
export function isSpecialName(name: string): name is SpecialName {
  return SpecialNames.includes(name as SpecialName);
}

/**
 * A custom typeguard to check whether a string is a valid Skill name
 * @param name - the string to test
 * @returns whether the name is a Skill name
 */
export function isSkillName(name: string): name is SkillName {
  return SkillNames.includes(name as SkillName);
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

/**
 * Get an Actor for actions without explicit associated Actor. This first tries
 * to get an actor from the controlled tokens. Afterwards it tries to get the
 * impersonated actor of the user. If neither works, null is returned.
 */
export function getActor(): WvActor | null {
  if (canvas?.ready) {
    const controlled = canvas.tokens?.controlled;
    if (controlled?.length) {
      const token = controlled.shift();
      if (token) return token.actor;
    }
  }

  return getGame().user?.character ?? null;
}

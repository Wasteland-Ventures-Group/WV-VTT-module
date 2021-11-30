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
import { LOG } from "./systemLogger.js";

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
 * to get an Actor from the controlled Tokens. If no Token is passed,
 * {@link getFirstControlledToken} is used to get one. If there is either no
 * controlled Token or the controlled Token has no Actor it tries to
 * get the impersonated Actor of the User. If neither works, null is returned.
 */
export function getActor(controlledToken?: Token | null): WvActor | undefined {
  const token = controlledToken ?? getFirstControlledToken();
  if (token?.actor) return token.actor;
  LOG.info("getActor(): Could not get an Actor from a Token.");

  const user = getGame().user;
  if (!user) {
    LOG.warn("getActor(): There was no user.");
    return;
  }

  if (!user.character) LOG.info("getActor(): The user had no character.");

  return user.character;
}

/**
 * Get the token for an actor. If no Actor is passed, this gets the current
 * User's Actor. If it has an Actor and that Actor has exactly 1 active Token in
 * the current Scene, that Token is returned. In all other cases, null is
 * returned.
 */
export function getActorToken(chosenActor?: Actor | null): Token | undefined {
  const actor = chosenActor ?? getGame().user?.character;
  if (!actor) {
    LOG.warn("getActorToken(): Could not get an Actor.");
    return;
  }

  const tokens = actor.getActiveTokens();
  if (tokens.length !== 1) {
    if (tokens.length === 0) {
      LOG.info("getActorToken(): There were no active tokens in the scene.");
    } else {
      LOG.info(
        "getActorToken(): There was more than one active token in the scene."
      );
    }
    return;
  }

  return tokens[0];
}

/** Get the first controlled Token. */
export function getFirstControlledToken(): Token | undefined {
  if (!canvas?.ready) {
    LOG.warn("getFirstControlledToken(): The canvas wasn't ready yet.");
    return;
  }

  const controlled = canvas.tokens?.controlled;
  if (!controlled?.length) {
    LOG.info("getFirstControlledToken(): There were no controlled tokens.");
    return;
  }

  return controlled[0];
}

/** Get the first User target. */
export function getFirstTarget(): Token | undefined {
  const user = getGame().user;
  if (!user) {
    LOG.warn("getFirstTarget(): There was no user.");
    return;
  }

  const targets = Array.from(user.targets);
  if (!targets.length) {
    LOG.info("getFirstTarget(): There were no User targets.");
    return;
  }

  return targets[0];
}

/** Get the range between a token and a target. */
export function getRange(
  token: Token | null | undefined,
  target: Token | null | undefined
): number | undefined {
  if (!token || !target) {
    if (!token) LOG.info("getRange(): The passed token was not present.");
    if (!target) LOG.info("getRange(): The passed target was not present.");
    return;
  }

  if (!canvas?.grid) {
    LOG.warn("getRange(): There was either no canvas or grid.");
    return;
  }

  return canvas.grid.measureDistances(
    [{ ray: new Ray(token.center, target.center) }],
    { gridSpaces: true }
  )[0];
}

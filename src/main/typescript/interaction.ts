import type WvActor from "./actor/wvActor.js";
import { getGame } from "./foundryHelpers.js";
import { LOG } from "./systemLogger.js";

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

/** Get the distance in meters between a token and a target. */
export function getDistance(
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

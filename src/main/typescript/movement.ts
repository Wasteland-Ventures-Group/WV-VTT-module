import type WvActor from "./actor/wvActor.js";
import { CONSTANTS } from "./constants.js";

/** Get the walk AP cost per meter for the given actor or the default. */
export function getWalkApPerMeter(actor?: WvActor): number {
  return (
    CONSTANTS.rules.movement.apPerMeter +
    (actor
      ? actor.crippledLegs * CONSTANTS.rules.movement.penaltyPerCrippledLeg
      : 0)
  );
}

/** Get the walk meters per AP for the given actor or the default. */
export function getWalkMetersPerAp(actor?: WvActor): number {
  return 1 / getWalkApPerMeter(actor);
}

/**
 * Get the walk AP needed for the given distance and given actor or the default.
 */
export function getWalkApForDistance(
  distance: number,
  actor?: WvActor
): number {
  return Math.floor(Math.ceil(distance) * getWalkApPerMeter(actor));
}

/** Get the walk movement range of the given actor. */
export function getGroundMoveRange(actor: WvActor): number {
  return actor.actionPoints.value * getWalkMetersPerAp(actor);
}

/** Get the ground sprint movement range of the given actor. */
export function getGroundSprintMoveRange(actor: WvActor): number {
  const actionPoints =
    actor.actionPoints.value +
    Math.floor(actor.data.data.specials.endurance.permTotal / 2);
  return actionPoints * getWalkMetersPerAp(actor);
}

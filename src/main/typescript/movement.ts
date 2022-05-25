import type WvActor from "./actor/wvActor.js";
import { CONSTANTS } from "./constants.js";

/** Get the AP needed to move the given distance. */
export function getApUse(distance: number): number {
  return Math.floor(Math.ceil(distance) / CONSTANTS.rules.movement.metersPerAp);
}

/** Get the ground movement range of the given actor. */
export function getGroundMoveRange(actor: WvActor): number {
  return actor.actionPoints.value * CONSTANTS.rules.movement.metersPerAp;
}

/** Get the ground sprint movement range of the given actor. */
export function getGroundSprintMoveRange(actor: WvActor): number {
  const actionPoints =
    actor.actionPoints.value +
    Math.floor(actor.data.data.specials.endurance.permTotal / 2);
  return actionPoints * CONSTANTS.rules.movement.metersPerAp;
}

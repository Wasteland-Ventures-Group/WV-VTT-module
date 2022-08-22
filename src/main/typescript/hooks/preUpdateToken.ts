import WvActor from "../actor/wvActor.js";
import { CONSTANTS } from "../constants.js";
import { getCanvas, getGame } from "../foundryHelpers.js";
import { getWalkApForDistance } from "../movement.js";
import { AlwaysNeverSetting, Movement } from "../settings.js";
import { LOG } from "../systemLogger.js";

/** Register system callbacks for the preUpdateToken hook. */
export default function registerForPreUpdateToken(): void {
  Hooks.on("preUpdateToken", checkApCostForMovement);
}

type HookParams = Parameters<Hooks.PreUpdateDocument<typeof TokenDocument>>;
type ChangeData = HookParams[1] & Partial<Position>;
type Position = { x: number; y: number };

/**
 * Check the AP cost of a potential movement and prevent updating the token if
 * needed.
 */
function checkApCostForMovement(
  document: HookParams[0],
  change: ChangeData,
  options: HookParams[2],
  userId: HookParams[3]
): false | void {
  if (!document.inCombat) return;

  const target = getTargetPosition(document.data, change);
  if (!isPositionUpdate(document.data, target)) return;

  const game = getGame();
  const grid = getCanvas().grid;
  if (!(grid instanceof GridLayer)) throw new Error("The canvas has no grid.");

  const user = game.users?.get(userId);
  if (!(user instanceof User)) throw new Error("Could not find the user.");

  if (!(document.actor instanceof WvActor)) {
    if (ui.notifications)
      ui.notifications.error(
        game.i18n.format("wv.system.messages.noActor", { name: document.name })
      );
    LOG.error(`The token has no associated actor! id="${document.id}"`);
    return false;
  }

  const apUse = getWalkApCost(document.actor, document.data, target);
  const currAp = document.actor.actionPoints.value;

  if (shouldEnforceAp(game, user) && currAp < apUse) {
    if (ui.notifications)
      ui.notifications.info(
        game.i18n.format("wv.system.messages.notEnoughApToMove", {
          actual: currAp,
          name: document.name,
          needed: apUse
        })
      );
    return false;
  }

  if (shouldSubtractAp(game, user))
    document.actor.updateActionPoints(Math.max(currAp - apUse, 0));
}

function getTargetPosition(origin: Position, change: ChangeData): Position {
  return { x: change.x ?? origin.x, y: change.y ?? origin.y };
}

function isPositionUpdate(origin: Position, target: Position): boolean {
  return origin.x !== target.x || origin.y !== target.y;
}

function getWalkApCost(
  actor: WvActor,
  origin: Position,
  target: Position
): number {
  const grid = getCanvas().grid;
  if (!(grid instanceof GridLayer)) throw new Error("The canvas has no grid.");

  const ray = new Ray(origin, target);
  return getWalkApForDistance(
    grid.measureDistances([{ ray }], { gridSpaces: true })[0] ?? 0,
    actor
  );
}

function shouldEnforceAp(game: Game, user: User): boolean {
  return (
    AlwaysNeverSetting.ALWAYS ===
    game.settings.get(
      CONSTANTS.systemId,
      user.isGM
        ? Movement.enforceApForGameMasters
        : Movement.enforceAndSubtractApForPlayers
    )
  );
}

function shouldSubtractAp(game: Game, user: User): boolean {
  return (
    AlwaysNeverSetting.ALWAYS ===
    game.settings.get(
      CONSTANTS.systemId,
      user.isGM
        ? Movement.subtractApForGameMasters
        : Movement.enforceAndSubtractApForPlayers
    )
  );
}

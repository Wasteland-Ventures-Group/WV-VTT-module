import { getCanvas, getGame } from "../foundryHelpers.js";
import { getApUse } from "../movement.js";
import WvActor from "../actor/wvActor.js";
import { LOG } from "../systemLogger.js";
import { CONSTANTS } from "../constants.js";
import { enforceApDragDropSettingName, EnforceApSetting } from "../settings.js";

export default class WvToken extends Token {
  protected override async _onDragLeftDrop(
    event: TokenMoveEvent
  ): Promise<unknown> {
    // Prepare some stuff and check presence.
    const game = getGame();
    const setting = game.settings.get(
      CONSTANTS.systemId,
      enforceApDragDropSettingName
    );
    if (
      setting === EnforceApSetting.DISABLED ||
      (setting === EnforceApSetting.PLAYERS && game.user?.isGM)
    )
      return super._onDragLeftDrop(event);

    const canvas = getCanvas();
    const grid = canvas.grid;
    if (!(grid instanceof GridLayer))
      throw new Error("The canvas has no grid!");
    const { originalEvent } = event.data;
    const preview = game.settings.get("core", "tokenDragPreview");

    // Go over the token clones in the event data.
    const clones: ClonedToken[] = [];
    for (const clone of event.data.clones ?? []) {
      const original = clone._original;

      // When not in combat, drag and drop movement is not AP checked.
      if (!original.inCombat) {
        clones.push(clone);
        continue;
      }

      // This can happen with tokens created by code.
      if (!(clone.actor instanceof WvActor)) {
        if (preview) original.updateSource({ noUpdateFog: true });
        if (ui.notifications)
          ui.notifications.error(
            game.i18n.format("wv.messages.movement.noActor", {
              name: clone.name
            })
          );
        LOG.error(`The token has no associated actor! id="${clone.id}"`);
        continue;
      }

      // Get the starting position.
      const origin = { x: original.data.x, y: original.data.y };

      // Get the snapped top-left coordinate.
      let target = { x: clone.data.x, y: clone.data.y };
      if (!originalEvent.shiftKey && grid.type !== CONST.GRID_TYPES.GRIDLESS) {
        const isTiny = clone.data.width < 1 && clone.data.height < 1;
        target = grid.getSnappedPosition(target.x, target.y, isTiny ? 2 : 1);
      }

      // Get the two AP values.
      const ray = new Ray(origin, target);
      const apUse = getApUse(
        grid.measureDistances([{ ray }], { gridSpaces: true })[0] ?? 0
      );
      const currAp = clone.actor.actionPoints.value;

      // Check if there are enough AP for the movement.
      if (currAp >= apUse) {
        // Update the AP on the actor, then hand it off to the super method.
        clone.actor.updateActionPoints(currAp - apUse);
        clones.push(clone);
      } else {
        // Reset the vision and warn the user when there are not enough AP to
        // move.
        if (preview) original.updateSource({ noUpdateFog: true });
        if (ui.notifications)
          ui.notifications.info(
            game.i18n.format("wv.messages.movement.notEnoughAp", {
              actual: currAp,
              name: clone.name,
              needed: apUse
            })
          );
      }
    }

    event.data.clones = clones;
    return super._onDragLeftDrop(event);
  }
}

type TokenMoveEvent = PIXI.InteractionEvent & { data: TokenMoveData };

interface TokenMoveData {
  clones?: ClonedToken[];
}

type ClonedToken = WvToken & { _original: WvToken };

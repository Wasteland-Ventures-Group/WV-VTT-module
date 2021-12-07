import WvActor from "../actor/wvActor.js";
import { CONSTANTS } from "../constants.js";
import { getCanvas, getGame } from "../foundryHelpers.js";
import { getApUse } from "../movement.js";
import { enforceApRulerSettingName, EnforceApSetting } from "../settings.js";
import { LOG } from "../systemLogger.js";

export default class WvRuler extends Ruler {
  override measure(
    destination: Point,
    { gridSpaces }: { gridSpaces?: boolean } = {}
  ): Ruler.Segment[] {
    return this.replaceLabels(super.measure(destination, { gridSpaces }));
  }

  override async moveToken(): Promise<false | undefined> {
    // Prepare some stuff and check presence.
    const game = getGame();
    const setting = game.settings.get(
      CONSTANTS.systemId,
      enforceApRulerSettingName
    );
    if (
      setting === EnforceApSetting.DISABLED ||
      (setting === EnforceApSetting.PLAYERS && game.user?.isGM)
    )
      return super.moveToken();

    const canvas = getCanvas();
    const grid = canvas.grid;
    if (!(grid instanceof GridLayer))
      throw new Error("The canvas has no grid!");

    // Get the movement token and check actor presence.
    const token = this._getMovementToken();
    if (!token) return false;
    if (!(token.actor instanceof WvActor)) {
      if (ui.notifications)
        ui.notifications.error(
          game.i18n.format("wv.messages.movement.noActor", {
            name: token.name
          })
        );
      LOG.error(`The token has no associated actor! id="${token.id}"`);
      return false;
    }

    // When not in combat, just do the normal movement.
    if (!token.inCombat) return super.moveToken();

    // Get the segments and calculate total distance.
    const segments = this._getRaysFromWaypoints(
      this.waypoints,
      this.destination ?? undefined
    ).map((ray) => ({ ray }));
    const distance = grid
      .measureDistances(segments, { gridSpaces: true })
      .reduce((a, b) => a + b, 0);

    // Get the two AP values.
    const apUse = getApUse(distance);
    const currAp = token.actor.actionPoints.value;

    // Check if there are enough AP for the movement.
    if (currAp >= apUse) {
      // Update the AP on the actor
      token.actor.updateActionPoints(currAp - apUse);
    } else {
      // Warn the user when there are not enough AP to move.
      if (ui.notifications)
        ui.notifications.info(
          game.i18n.format("wv.messages.movement.notEnoughAp", {
            actual: currAp,
            name: token.name,
            needed: apUse
          })
        );
      return false;
    }

    return super.moveToken();
  }

  /**
   * Replace the labels and texts of the given Ruler segments with added movement
   * information.
   */
  replaceLabels(segments: Ruler.Segment[]): Ruler.Segment[] {
    let totalDistance = 0;
    for (const segment of segments) {
      const distance = segment.distance;
      totalDistance += distance;

      const text = this.getLabel(distance, totalDistance, segment.last);

      segment.text = text;
      if (segment.label instanceof PreciseText) {
        segment.label.text = text;

        if (segment.label.style instanceof PIXI.TextStyle)
          segment.label.style.align = "left";
      }
    }

    return segments;
  }

  /** Get the label for a segment. */
  getLabel(
    segmentDistance: number,
    totalDistance: number,
    isTotal: boolean
  ): string {
    if (!canvas?.scene) throw new Error("There was no canvas or scene!");

    const units = canvas.scene.data.gridUnits;
    const apUnit = getGame().i18n.localize("wv.ruler.apCostUnit");
    const segmentApUse = getApUse(segmentDistance);
    const totalApUse = getApUse(totalDistance);

    let label = `${Math.round(segmentDistance * 100) / 100} ${units}`;
    if (isTotal)
      label += ` [${Math.round(totalDistance * 100) / 100} ${units}]`;

    label += "\n";
    label += `${segmentApUse} ${apUnit}`;
    if (isTotal) label += ` [${totalApUse} ${apUnit}]`;

    const token = this._getMovementToken();
    if (token?.actor instanceof WvActor) {
      const currentAp = token.actor.actionPoints.value;
      const segmentApRemaining = currentAp - segmentApUse;
      const totalApRemaining = currentAp - totalApUse;

      label += "\n";
      label += `${segmentApRemaining} ${apUnit}`;
      if (isTotal) label += ` [${totalApRemaining} ${apUnit}]`;
    }

    return label;
  }
}
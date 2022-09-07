import WvActor from "../actor/wvActor.js";
import { getGame } from "../foundryHelpers.js";
import { getWalkApForDistance } from "../movement.js";

export default class WvRuler extends Ruler {
  override measure(
    destination: Point,
    { gridSpaces }: { gridSpaces?: boolean } = {}
  ): Ruler.Segment[] {
    return this.replaceLabels(
      super.measure(destination, { gridSpaces: gridSpaces ?? true })
    );
  }

  /**
   * Replace the labels and texts of the given Ruler segments with added
   * movement information.
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
    if (!canvas?.scene) throw new Error("There was no canvas or scene.");

    const token = this._getMovementToken();
    const actor = token?.actor ?? undefined;

    const units = canvas.scene.data.gridUnits;
    const apUnit = getGame().i18n.localize("wv.rules.actionPoints.short");
    const segmentApUse = getWalkApForDistance(segmentDistance, actor);
    const totalApUse = getWalkApForDistance(totalDistance, actor);

    let label = `${Math.round(segmentDistance * 100) / 100} ${units}`;
    if (isTotal)
      label += ` [${Math.round(totalDistance * 100) / 100} ${units}]`;

    label += "\n";
    label += `${segmentApUse} ${apUnit}`;
    if (isTotal) label += ` [${totalApUse} ${apUnit}]`;

    if (actor instanceof WvActor) {
      const currentAp = actor.actionPoints.value;
      const segmentApRemaining = currentAp - segmentApUse;
      const totalApRemaining = currentAp - totalApUse;

      label += "\n";
      label += `${segmentApRemaining} ${apUnit}`;
      if (isTotal) label += ` [${totalApRemaining} ${apUnit}]`;
    }

    return label;
  }
}

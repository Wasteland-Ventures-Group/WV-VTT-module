import { getGame } from "../foundryHelpers.js";
import { getApUse } from "../movement.js";

export default class WvRuler extends Ruler {
  override measure(
    destination: Point,
    { gridSpaces }: { gridSpaces?: boolean } = {}
  ): Ruler.Segment[] {
    return replaceLabels(super.measure(destination, { gridSpaces }));
  }
}

export function replaceLabels(segments: Ruler.Segment[]): Ruler.Segment[] {
  let totalDistance = 0;
  for (const segment of segments) {
    const distance = segment.distance;
    totalDistance += distance;

    const text = getLabel(distance, totalDistance, segment.last);

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
function getLabel(
  segmentDistance: number,
  totalDistance: number,
  isTotal: boolean
): string {
  if (!canvas?.scene) throw new Error("There was no canvas or scene!");

  const units = canvas.scene.data.gridUnits;
  const apUnit = getGame().i18n.localize("wv.ruler.apCostUnit");

  let label = `${Math.round(segmentDistance * 100) / 100} ${units}`;
  if (isTotal) label += ` [${Math.round(totalDistance * 100) / 100} ${units}]`;

  label += "\n";
  label += `${getApUse(segmentDistance)} ${apUnit}`;
  if (isTotal) label += ` [${getApUse(totalDistance)} ${apUnit}]`;

  return label;
}

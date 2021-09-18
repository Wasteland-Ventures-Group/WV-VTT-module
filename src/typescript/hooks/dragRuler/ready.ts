import { CONSTANTS } from "../../constants.js";
import type { DragRuler } from "../../integrations/dragRuler/dragRuler.js";
import { createWvSpeedProvider } from "../../integrations/dragRuler/wvSpeedProvider.js";

export default function registerForDragRulerReady(): void {
  Hooks.once("dragRuler.ready", dragRulerReady);
}

function dragRulerReady(speedProvider: typeof DragRuler.SpeedProvider): void {
  if (dragRuler) {
    dragRuler.registerSystem(
      CONSTANTS.systemId,
      createWvSpeedProvider(speedProvider)
    );
  }
}

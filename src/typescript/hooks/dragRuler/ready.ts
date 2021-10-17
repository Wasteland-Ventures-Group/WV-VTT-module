import { CONSTANTS } from "../../constants.js";
import type { DragRuler } from "../../integrations/dragRuler/dragRuler.js";
import createWvSpeedProvider from "../../integrations/dragRuler/wvSpeedProvider.js";

/** Register system callbacks for the DragRule module ready hook. */
export default function registerForDragRulerReady(): void {
  Hooks.once("dragRuler.ready", registerWvSpeedProvider);
}

/** Register the system speed provider for the DragRuler module. */
function registerWvSpeedProvider(
  speedProvider: typeof DragRuler.SpeedProvider
): void {
  if (dragRuler) {
    dragRuler.registerSystem(
      CONSTANTS.systemId,
      createWvSpeedProvider(speedProvider)
    );
  }
}

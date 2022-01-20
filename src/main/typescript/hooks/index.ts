import registerForDragRulerReady from "./dragRuler/ready.js";
import registerForHotbarDrop from "./hotbarDrop.js";
import registerForInit from "./init.js";
import registerForReady from "./ready.js";
import registerForRenderChatMessage from "./renderChatMessage/index.js";
import registerForUpdateActor from "./updateActor.js";

/** Register system callbacks for all used hooks. */
export default function registerForHooks(): void {
  registerForInit();
  registerForReady();

  registerForHotbarDrop();
  registerForRenderChatMessage();

  registerForUpdateActor();

  registerForDragRulerReady();
}

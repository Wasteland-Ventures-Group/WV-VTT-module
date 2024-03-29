import registerForDragRulerReady from "./dragRuler/ready.js";
import registerForHotbarDrop from "./hotbarDrop.js";
import registerForInit from "./init.js";
import registerForPreUpdateToken from "./preUpdateToken.js";
import registerForReady from "./ready.js";
import registerForRenderChatLog from "./renderChatLog.js";
import registerForRenderChatMessage from "./renderChatMessage/index.js";
import registerForUpdateActor from "./updateActor.js";

/** Register system callbacks for all used hooks. */
export default function registerForHooks(): void {
  registerForInit();
  registerForReady();

  registerForHotbarDrop();
  registerForRenderChatLog();
  registerForRenderChatMessage();

  registerForPreUpdateToken();

  registerForUpdateActor();

  registerForDragRulerReady();
}

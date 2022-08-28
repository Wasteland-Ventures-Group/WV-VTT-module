import registerForDragRulerReady from "./dragRuler/ready.js";
import registerForHotbarDrop from "./hotbarDrop.js";
import registerForInit from "./init.js";
import registerForPreCreateItem from "./preCreateItem.js";
import registerForPreUpdateToken from "./preUpdateToken.js";
import registerForQuenchReady from "./quench/ready.js";
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

  registerForPreCreateItem();

  registerForPreUpdateToken();

  registerForUpdateActor();

  registerForDragRulerReady();
  registerForQuenchReady();
}

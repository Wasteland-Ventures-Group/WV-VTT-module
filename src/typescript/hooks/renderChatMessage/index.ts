import decorateCriticalRollMessage from "./decorateCriticalRollMessage.js";
import decorateSystemMessage from "./decorateSystemMessage.js";

/** Register system callbacks for the renderChatMessage hook. */
export default function registerForRenderChatMessage(): void {
  Hooks.on("renderChatMessage", decorateCriticalRollMessage);
  Hooks.on("renderChatMessage", decorateSystemMessage);
}

export type HookParams = Parameters<Hooks.StaticCallbacks["renderChatMessage"]>;

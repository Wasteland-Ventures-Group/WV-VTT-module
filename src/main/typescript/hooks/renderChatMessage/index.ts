import decorateCriticalRollMessage from "./decorateCriticalRollMessage.js";
import decorateSystemMessage from "./decorateSystemMessage/index.js";

/** Register system callbacks for the renderChatMessage hook. */
export default function registerForRenderChatMessage(): void {
  Hooks.on("renderChatMessageHTML", decorateCriticalRollMessage);
  Hooks.on("renderChatMessageHTML", decorateSystemMessage);
}

export type HookParams = Hooks.HookParameters<"renderChatMessageHTML">;

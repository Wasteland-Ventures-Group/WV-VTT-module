/**
 * Get a typesafe, initialized Game instance.
 * @throws if game has not yet been initialized.
 */
export function getGame(): Game {
  if (!(game instanceof Game)) throw new Error("Game was not yet initialized!");

  return game;
}

/**
 * Get a typesafe, initialized Canvas instance.
 * @throws if canvas has not yet been initialized.
 */
export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas))
    throw new Error("Canvas was not yet initialized!");

  return canvas;
}

/** Scroll the chat log to the bottom. */
export function scrollChatToBottom() {
  const sidebarChatLog = document.querySelector("#sidebar #chat-log");
  if (sidebarChatLog) sidebarChatLog.scrollTop = sidebarChatLog.scrollHeight;
  const popoutChatLog = document.querySelector("#chat-popout #chat-log");
  if (popoutChatLog) popoutChatLog.scrollTop = popoutChatLog.scrollHeight;
}

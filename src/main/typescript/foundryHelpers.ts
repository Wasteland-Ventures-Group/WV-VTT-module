/**
 * Get a typesafe, initialized Game instance.
 * @throws if game has not yet been initialized.
 */
export function getGame(): Game {
  if (!(game instanceof Game)) throw new Error("Game was not yet initialized.");

  return game;
}

/**
 * Get a typesafe, initialized Canvas instance.
 * @throws if canvas has not yet been initialized.
 */
export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas))
    throw new Error("Canvas was not yet initialized.");

  return canvas;
}

/** Scroll the chat log to the bottom. */
export function scrollChatToBottom() {
  const sidebarChatLog = document.querySelector("#sidebar #chat-log");
  if (sidebarChatLog) sidebarChatLog.scrollTop = sidebarChatLog.scrollHeight;
  const popoutChatLog = document.querySelector("#chat-popout #chat-log");
  if (popoutChatLog) popoutChatLog.scrollTop = popoutChatLog.scrollHeight;
}

/** Check whether two variables reference the same document. */
export function isSameDocument<T extends Actor | Item>(
  root: T | null,
  target: T | null
) {
  if (root === null || target === null) return false;

  return typeof root.id === "string" && typeof target.id === "string"
    ? root.uuid === target.uuid
    : root == target;
}

/** Check whether the given target is the owning actor of the given item. */
export function isOwningActor(root: Item, target: Actor) {
  return isSameDocument(root.parent, target);
}

/** Check whether the given root and target are items of the same actor. */
export function isSiblingItem(root: Item, target: Item) {
  return isSameDocument(root.parent, target.parent);
}

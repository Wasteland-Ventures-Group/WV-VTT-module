/**
 * Get a typesafe, initialized game instance.
 * @throws if game has not yet been initialized.
 */
export function getGame(): Game {
  if (!(game instanceof Game)) throw "Game was not yet initialized!";

  return game;
}

/**
 * Get the user IDs of all GM players.
 * @returns an array of GM user IDs.
 */
// TODO: replace with ChatMessage.getWhisperRecipients(), once types fixed
export function getGmIds(): string[] {
  const users = getGame().users;
  if (!users) throw "Users was not yet initialized!";

  return users.reduce<string[]>((a, u) => {
    if (u.isGM && u.id) a.push(u.id);
    return a;
  }, []);
}

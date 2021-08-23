/**
 * Get a typesafe, initialized game instance.
 * @throws if game has not yet been initialized.
 */
export function getGame(): Game {
  if (!(game instanceof Game)) throw "Game was not yet initialized!";

  return game;
}

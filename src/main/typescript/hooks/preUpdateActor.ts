/** Register system callbacks for the preUpdateActor hook. */
export default function registerForPreUpdateActor(): void {
  Hooks.on("preUpdateActor", validateChangeData);
}

/**
 * Validate the change data before updating an Actor.
 * @param actor - the Actor to update
 * @param change - the change data of the update
 * @returns whether updating the Actor should be allowed
 */
function validateChangeData(
  actor: Parameters<Hooks.PreUpdateDocument<typeof Actor>>[0],
  change: Parameters<Hooks.PreUpdateDocument<typeof Actor>>[1]
): boolean {
  return actor.validChangeData(change);
}

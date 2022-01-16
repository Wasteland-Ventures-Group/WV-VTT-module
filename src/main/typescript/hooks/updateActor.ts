/** Register system callbacks for the updateActor hook. */
export default function registerForUpdateActor(): void {
  Hooks.on("updateActor", reRenderItemSheetsOfActor);
}

/** Rerender open Item sheets for the given Actor. */
function reRenderItemSheetsOfActor(
  actor: Parameters<Hooks.UpdateDocument<typeof Actor>>[0]
): void {
  actor.items.forEach((item) => item.render(false));
}

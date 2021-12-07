import { isWeaponItem } from "../item/weapon.js";

/** Register system callbacks for the updateActor hook. */
export default function registerForUpdateActor(): void {
  Hooks.on("updateActor", reRenderWeaponSheetsWithSpecial);
}

/**
 * Rerender open sheets for Strength damage based Weapon Items of the given
 * Actor, if the Actor's Strength changed.
 * @param actor - the updeted Actor
 * @param change - the change data of the update
 */
function reRenderWeaponSheetsWithSpecial(
  actor: Parameters<Hooks.UpdateDocument<typeof Actor>>[0],
  change: Parameters<Hooks.UpdateDocument<typeof Actor>>[1]
): void {
  if (!hasSpecialChange(change)) return;

  actor.items.forEach((item) => {
    if (!isWeaponItem(item)) return;

    if (item.hasSomeSpecialBasedValues()) item.render(false);
  });
}

/** Check whether the passed change data has any SPECIAL change. */
function hasSpecialChange(
  change: Parameters<Hooks.UpdateDocument<typeof Actor>>[1]
): boolean {
  if (typeof change?.data?.specials === "undefined") return false;

  return Object.values(change.data.specials).length > 0;
}

import { isWeaponItem } from "../item/weapon.js";

/** Register system callbacks for the updateActor hook. */
export default function registerForUpdateActor(): void {
  Hooks.on("updateActor", reRenderWeaponSheetsWithStrength);
}

/**
 * Rerender open sheets for Strength damage based Weapon Items of the given
 * Actor, if the Actor's Strength changed.
 * @param actor - the updeted Actor
 * @param change - the change data of the update
 */
function reRenderWeaponSheetsWithStrength(
  actor: Parameters<Hooks.UpdateDocument<typeof Actor>>[0],
  change: Parameters<Hooks.UpdateDocument<typeof Actor>>[1]
): void {
  if (!change?.data?.specials?.strength) return;

  actor.items.forEach((item) => {
    if (!isWeaponItem(item)) return;

    if (
      Object.values(item.systemData.attacks.sources).some(
        (attack) => attack.damage.diceRange
      )
    )
      item.render(false);
  });
}

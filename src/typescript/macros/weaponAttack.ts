import { getGame } from "../foundryHelpers.js";
import Weapon from "../item/weapon.js";
import Attack, { WeaponAttackDragData } from "../item/weapon/attack.js";

/**
 * Assign a Weapon Attack Macro to the user's hotbar. This will assign an
 * already existing Macro, if one with the same properties already exists, as
 * would be created from the drag data.
 * @param slot - the hotbar slot to assign the macro to
 * @param data - the Weapon Attack drag data
 */
export default async function assignWeaponAttackMacro(
  slot: number,
  data: WeaponAttackDragData
): Promise<void> {
  const macro = await getOrCreateWeaponAttackMacro(data);
  getGame().user?.assignHotbarMacro(macro ?? null, slot);
}

/**
 * Try to find an existing Weapon Attack Macro with the same properties or
 * create a new one.
 * @param data - the Weapon Attack drag data
 * @returns a Weapon Attack Macro
 */
async function getOrCreateWeaponAttackMacro(
  data: WeaponAttackDragData
): Promise<Macro | undefined> {
  const actor = getGame().actors?.get(data.actorId);
  if (!(actor instanceof Actor)) return;

  const weapon = actor.items.get(data.weaponId);
  if (!(weapon instanceof Weapon)) return;

  const name = createMacroName(
    actor.toObject(),
    weapon.toObject(),
    data.attackName
  );
  const command = createMacroCommand(data);

  const existingMacro = getGame().macros?.find(
    (m) => m.name === name && m.data.command === command
  );
  if (existingMacro) return existingMacro;

  return Macro.create(
    { command, name, type: "script", img: weapon.img },
    { renderSheet: false }
  );
}

/**
 * Create a Macro name from the actor, weapon data and attack name.
 * @param actorData - the source data of the Actor, the Macro is for
 * @param weaponData - the source data of the Weapon, the Macro is for
 * @param attackName - the name of the Attack, the Macro is for
 * @returns the Macro name
 */
function createMacroName(
  actorData: foundry.data.ActorData["_source"],
  weaponData: foundry.data.ItemData["_source"],
  attackName: string
): string {
  return `${actorData.name}/${weaponData.name}/${attackName}`;
}

/**
 * Create a Macro command from the given Weapon Attack drag data.
 * @param data - the Weapon Attack drag data
 * @returns the Macro command
 */
function createMacroCommand(data: WeaponAttackDragData): string {
  return `game.wv.macros.executeWeaponAttack("${data.actorId}", "${data.weaponId}", "${data.attackName}")`;
}

/**
 * Execute a Weapon Attack macro on an Actor.
 * @param actorId - the ID of the Actor, the weapon belongs to
 * @param weaponId - the ID of the Weapon on the Actor
 * @param attackName - the name of the Attack on the weapon
 */
export function executeWeaponAttack(
  actorId: string,
  weaponId: string,
  attackName: string
): void {
  const actor = getGame().actors?.get(actorId);
  if (!(actor instanceof Actor)) return;

  const weapon = actor.items.get(weaponId);
  if (!(weapon instanceof Weapon)) return;

  const attack = weapon.systemData.attacks.attacks[attackName];
  if (!(attack instanceof Attack)) return;

  attack.execute();
}

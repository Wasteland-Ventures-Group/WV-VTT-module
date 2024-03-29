import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";
import type { WeaponAttackDragData } from "../dragData.js";
import { getGame } from "../foundryHelpers.js";
import Weapon from "../item/weapon.js";
import SystemDataSchemaError from "../systemDataSchemaError.js";

/**
 * Assign a Weapon Attack Macro to the user's hotbar. This will assign an
 * already existing Macro, if one with the same properties already exists, as
 * would be created from the drag data.
 * @param slot - the hotbar slot to assign the Macro to
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
  const actor = data.actorId ? getGame().actors?.get(data.actorId) : null;

  let weapon;
  if (actor) {
    weapon = actor.items.get(data.weaponId);
  } else {
    weapon = getGame().items?.get(data.weaponId);
  }
  if (!(weapon instanceof Weapon)) return;

  const name = createMacroName(
    weapon.toObject(),
    data.attackName,
    actor?.toObject()
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
 * Create a Macro name from the optional Actor, Weapon data and Attack name.
 * @param weaponData - the source data of the Weapon, the Macro is for
 * @param attackName - the name of the Attack, the Macro is for
 * @param actorData - the source data of the Actor, the Macro is for
 * @returns the Macro name
 */
function createMacroName(
  weaponData: foundry.data.ItemData["_source"],
  attackName: string,
  actorData?: foundry.data.ActorData["_source"] | null | undefined
): string {
  const tail = `${weaponData.name}/${attackName}`;
  return actorData ? `${actorData.name}/${tail}` : tail;
}

/**
 * Create a Macro command from the given Weapon Attack drag data.
 * @param data - the Weapon Attack drag data
 * @returns the Macro command
 */
function createMacroCommand(data: WeaponAttackDragData): string {
  const args = [data.weaponId, data.attackName];
  if (data.actorId) args.push(data.actorId);

  return `game.wv.macros.executeWeaponAttack("${args.join('","')}")`;
}

/**
 * Execute a Weapon Attack Macro.
 * @param weaponId - the ID of the Weapon
 * @param attackName - the name of the Attack on the Weapon
 * @param actorId - the ID of the Actor, the Weapon belongs to, blank if unowned
 */
export function executeWeaponAttack(
  weaponId: string,
  attackName: string,
  actorId?: string | null | undefined
): void {
  let weapon;

  if (typeof actorId === "string" && actorId !== "") {
    const actor = getGame().actors?.get(actorId);
    if (!(actor instanceof Actor)) return;

    weapon = actor.items.get(weaponId);
  } else {
    weapon = getGame().items?.get(weaponId);
  }
  if (!(weapon instanceof Weapon)) return;

  const attack = weapon.data.data.attacks.attacks[attackName];
  if (!attack) return;

  attack.execute();
}

/**
 * Execute a Weapon Attack from the provided Weapon source.
 * @param data - the source data of the weapon
 * @param attackName - the name of the weapon attack in the source data
 */
export async function executeWeaponAttackFromSource(
  data: ItemDataConstructorData,
  attackName: string
): Promise<void> {
  let weapon;
  try {
    weapon = await Weapon.create(data, { temporary: true });
  } catch (error) {
    if (error instanceof SystemDataSchemaError) {
      ui?.notifications?.error("wv.system.messages.invalidSystemDataInMacro", {
        localize: true
      });
    }
    throw error;
  }

  if (!(weapon instanceof Weapon)) {
    ui?.notifications?.error("wv.system.messages.couldNotCreateDocument", {
      localize: true
    });
    return;
  }
  weapon.finalizeData();

  const attack = weapon.data.data.attacks.attacks[attackName];
  if (!attack) {
    ui?.notifications?.error(
      getGame().i18n.format("wv.system.messages.attackNotFound", {
        name: attackName
      })
    );
    return;
  }

  attack.execute();
}

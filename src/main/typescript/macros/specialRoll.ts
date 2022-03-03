import type { SpecialDragData } from "../dragData.js";
import type { SpecialName } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/**
 * Assign a SPECIAL roll Macro to the user's hotbar. This will assign an
 * already existing Macro, if one with the same properties already exists, as
 * would be created from the drag data.
 * @param slot - the hotbar slot to assign the Macro to
 * @param data - the SPECIAL drag data
 */
export default async function assignSpecialRollMacro(
  slot: number,
  data: SpecialDragData
): Promise<void> {
  const macro = await getOrCreateSpecialRollMacro(data);
  getGame().user?.assignHotbarMacro(macro ?? null, slot);
}

/**
 * Try to find an existing SPECIAL roll Macro with the same properties or create
 * a new one.
 * @param data - the SPECIAL roll drag data
 * @returns a SPECIAL roll Macro
 */
async function getOrCreateSpecialRollMacro(
  data: SpecialDragData
): Promise<Macro | undefined> {
  const actor = getGame().actors?.get(data.actorId);
  if (!(actor instanceof Actor)) return;

  const name = createMacroName(actor.toObject(), data.specialName);
  const command = createMacroCommand(data);

  const existingMacro = getGame().macros?.find(
    (m) => m.name === name && m.data.command === command
  );
  if (existingMacro) return existingMacro;

  return Macro.create(
    { command, name, type: "script" },
    { renderSheet: false }
  );
}

/**
 * Create a Macro name from the Actor and SPECIAL name.
 * @param actorData - the source data of the Actor, the Macro is for
 * @param specialName - the name of the SPECIAL, the Macro is for
 * @returns the Macro name
 */
function createMacroName(
  actorData: foundry.data.ActorData["_source"],
  specialName: SpecialName
): string {
  return `${actorData.name}/${specialName}`;
}

/**
 * Create a Macro command from the given SPECIAL roll drag data.
 * @param data - the SPECIAL roll drag data
 * @returns the Macro command
 */
function createMacroCommand(data: SpecialDragData): string {
  return `game.wv.macros.executeSpecialRoll("${data.actorId}", "${data.specialName}")`;
}

/**
 * Execute a SPECIAL roll Macro on an Actor.
 * @param actorId - the ID of the Actor, the SPECIAL belongs to
 * @param specialName - the name of the SPECIAL on the Actor
 */
export function executeSpecialRoll(
  actorId: string,
  specialName: SpecialName
): void {
  const actor = getGame().actors?.get(actorId);
  if (!(actor instanceof Actor)) return;

  actor.rollSpecial(specialName);
}

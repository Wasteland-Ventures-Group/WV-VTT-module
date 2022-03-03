import type { SkillDragData } from "../dragData.js";
import type { SkillName } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/**
 * Assign a Skill roll Macro to the user's hotbar. This will assign an already
 * existing Macro, if one with the same properties already exists, as would be
 * created from the drag data.
 * @param slot - the hotbar slot to assign the Macro to
 * @param data - the Skill drag data
 */
export default async function assignSkillRollMacro(
  slot: number,
  data: SkillDragData
): Promise<void> {
  const macro = await getOrCreateSkillRollMacro(data);
  getGame().user?.assignHotbarMacro(macro ?? null, slot);
}

/**
 * Try to find an existing Skill roll Macro with the same properties or create
 * a new one.
 * @param data - the Skill roll drag data
 * @returns a Skill roll Macro
 */
async function getOrCreateSkillRollMacro(
  data: SkillDragData
): Promise<Macro | undefined> {
  const actor = getGame().actors?.get(data.actorId);
  if (!(actor instanceof Actor)) return;

  const name = createMacroName(actor.toObject(), data.skillName);
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
 * Create a Macro name from the Actor and Skill name.
 * @param actorData - the source data of the Actor, the Macro is for
 * @param specialName - the name of the Skill, the Macro is for
 * @returns the Macro name
 */
function createMacroName(
  actorData: foundry.data.ActorData["_source"],
  skillName: SkillName
): string {
  return `${actorData.name}/${skillName}`;
}

/**
 * Create a Macro command from the given Skill roll drag data.
 * @param data - the Skill roll drag data
 * @returns the Macro command
 */
function createMacroCommand(data: SkillDragData): string {
  return `game.wv.macros.executeSkillRoll("${data.actorId}", "${data.skillName}")`;
}

/**
 * Execute a Skill roll Macro on an Actor.
 * @param actorId - the ID of the Actor, the Skill belongs to
 * @param skillName - the name of the Skill on the Actor
 */
export function executeSkillRoll(actorId: string, skillName: SkillName): void {
  const actor = getGame().actors?.get(actorId);
  if (!(actor instanceof Actor)) return;

  actor.rollSkill(skillName);
}

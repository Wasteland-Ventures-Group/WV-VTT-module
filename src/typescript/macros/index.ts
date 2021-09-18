import { executeSkillRoll } from "./skillRoll.js";
import { executeSpecialRoll } from "./specialRoll.js";
import { executeWeaponAttack } from "./weaponAttack.js";

/** An object to hold references to system Macro command functions. */
export const macros = {
  /**
   * Execute a Skill roll Macro on an Actor.
   * @param actorId - the ID of the Actor, the Skill belongs to
   * @param skillName - the name of the Skill on the Actor
   */
  executeSkillRoll,

  /**
   * Execute a SPECIAL roll Macro on an Actor.
   * @param actorId - the ID of the Actor, the weapon belongs to
   * @param specialName - the name of the SPECIAL on the weapon
   */
  executeSpecialRoll,

  /**
   * Execute a Weapon Attack macro on an Actor.
   * @param actorId - the ID of the Actor, the weapon belongs to
   * @param weaponId - the ID of the Weapon on the Actor
   * @param attackName - the name of the Attack on the weapon
   */
  executeWeaponAttack
};

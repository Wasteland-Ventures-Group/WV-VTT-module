import { executeSkillRoll } from "./skillRoll.js";
import { executeSpecialRoll } from "./specialRoll.js";
import {
  executeWeaponAttack,
  executeWeaponAttackFromSource
} from "./weaponAttack.js";

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
   * Execute a Weapon Attack Macro.
   * @param weaponId - the ID of the Weapon
   * @param attackName - the name of the Attack on the Weapon
   * @param actorId - the ID of the Actor, the Weapon belongs to, blank if
   *                  unowned
   */
  executeWeaponAttack,

  /**
   * Execute a Weapon Attack from the provided Weapon source.
   * @param data - the source data of the weapon
   * @param attackName - the name of the weapon attack in the source data
   * @param options - additional roll options
   */
  executeWeaponAttackFromSource
};

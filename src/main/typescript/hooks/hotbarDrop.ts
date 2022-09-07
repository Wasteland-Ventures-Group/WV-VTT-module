import {
  isSkillDragData,
  isSpecialDragData,
  isWeaponAttackDragData
} from "../dragData.js";
import assignSkillRollMacro from "../macros/skillRoll.js";
import assignSpecialRollMacro from "../macros/specialRoll.js";
import assignWeaponAttackMacro from "../macros/weaponAttack.js";

/** Register system callbacks for the hotbarDrop hook. */
export default function registerForHotbarDrop(): void {
  Hooks.on(
    "hotbarDrop",
    async (_hotbar, data: Record<string, unknown>, slot) => {
      if (isWeaponAttackDragData(data)) {
        assignWeaponAttackMacro(slot, data);
      } else if (isSpecialDragData(data)) {
        assignSpecialRollMacro(slot, data);
      } else if (isSkillDragData(data)) {
        assignSkillRollMacro(slot, data);
      }
    }
  );
}

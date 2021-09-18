import { isWeaponAttackDragData } from "../item/weapon/attack.js";
import assignWeaponAttackMacro from "../macros/weaponAttack.js";

/** Register system callbacks for the hotbarDrop hook. */
export default function registerForHotbarDrop(): void {
  Hooks.on(
    "hotbarDrop",
    async (_hotbar, data: Record<string, unknown>, slot) => {
      if (isWeaponAttackDragData(data)) assignWeaponAttackMacro(slot, data);
    }
  );
}

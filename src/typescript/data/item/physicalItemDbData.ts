import { TYPES } from "../../constants.js";
import type { TemplateDocumentType } from "../common.js";
import Describable from "./mixins/describable.js";
import PhysicalItem from "./mixins/physicalItem.js";
import Ranged from "./mixins/ranged.js";
import Reloadable from "./mixins/reloadable.js";
import SkillChecking from "./mixins/skillChecking.js";
import StrengthRequiring from "./mixins/strengthRequiring.js";
import Weapon from "./mixins/weapon.js";
import { DbRules } from "./rules.js";

class RangedWeaponDataSourceDataBase implements TemplateDocumentType {
  /** The rules of the ranged weapon */
  rules = new DbRules();

  /** @override */
  getTypeName(): string {
    return TYPES.ITEM.RANGED_WEAPON;
  }
}

export const RangedWeaponDataSourceData = Describable(
  PhysicalItem(
    Ranged(
      Reloadable(
        SkillChecking(StrengthRequiring(Weapon(RangedWeaponDataSourceDataBase)))
      )
    )
  )
);

/** The Wasteland Ventures ranged weapon data source */
export interface RangedWeaponDataSource {
  type: typeof TYPES.ITEM.RANGED_WEAPON;
  data: typeof RangedWeaponDataSourceData;
}

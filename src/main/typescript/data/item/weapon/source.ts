import { SkillName, TYPES } from "../../../constants.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import PhysicalBaseItem from "../physicalBaseItem.js";
import { AttacksSource } from "./attack.js";
import type Ranges from "./ranges.js";
import type { Reload } from "./reload.js";

/** The Weapon Item data-source */
export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

/** The Weapon Item data-source data */
export class WeaponDataSourceData extends PhysicalBaseItem {
  /** The attacks of the weapon */
  attacks: AttacksSource = new AttacksSource();

  /** Whether the weapon is a holdout weapon. By default, this is `false`. */
  holdout?: boolean = false;

  /** The ranges of the weapon */
  ranges: Ranges = {
    short: {
      distance: 20,
      modifier: 0
    }
  };

  /**
   * The reload stats of the weapon. By default, the weapon does not support
   * reloading.
   */
  reload?: Reload;

  /** The skill associated with the weapon attacks */
  skill: SkillName = "firearms";

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: number = 0;

  override getTypeName(): string {
    return TYPES.ITEM.WEAPON;
  }
}

export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: "weapon";
}

import { SkillNames, TYPES } from "../../../constants.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import PhysicalBaseItem from "../physicalBaseItem.js";
import { DbAttacks } from "./attack.js";
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
  attacks: DbAttacks = new DbAttacks();

  /** Whether the weapon is a holdout weapon */
  holdout: boolean = false;

  /** The ranges of the weapon */
  ranges: Ranges = {
    short: {
      distance: 20,
      modifier: 0
    }
  };

  /**
   * The reload stats of the weapon.
   * This can be either "self" or an object with reload info.
   * "self" means it uses instances of the same item and needs to be "reloaded"
   * via a ready item action.
   * An object array has the needed info for a magazine reload.
   */
  reload: Reload = {
    ap: 0,
    caliber: undefined,
    containerType: "magazine",
    size: 0
  };

  /** The skill associated with the weapon attacks */
  skill: SkillNames = "firearms";

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

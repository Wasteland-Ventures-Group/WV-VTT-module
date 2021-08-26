import { TYPES } from "../../../constants.js";
import PhysicalBaseItem from "../physicalBaseItem.js";
import type Attack from "./attack.js";
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
  attacks: Attack[] = [];

  /** The ranges of the weapon */
  ranges: Ranges = {
    short: {
      distance: 20,
      modifier: 0
    },
    medium: {
      distance: 40,
      modifier: -10
    },
    long: {
      distance: 60,
      modifier: -20
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

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement = 0;

  override getTypeName(): string {
    return TYPES.ITEM.WEAPON;
  }
}

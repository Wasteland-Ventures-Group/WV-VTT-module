import { TAGS, TYPES } from "../constants.js";
import { WeaponDataPropertiesData } from "../data/item/weapon/properties.js";
import { LOG } from "../systemLogger.js";
import WvItem from "./wvItem.js";

/** An Item that can represent a weapon in the Wasteland Ventures system. */
export default class Weapon extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.WEAPON)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.WEAPON}.`);

    super(data, context);
  }

  override prepareBaseData(): void {
    this.data.data = new WeaponDataPropertiesData(this.data.data, this);
  }

  override finalizeData(): void {
    if (!this.actor) {
      LOG.warn(
        `Trying to finalize a weapon without a parent actor. ${this.ident}`
      );
    }

    Object.values(this.data.data.attacks.attacks).forEach((attack) => {
      if (!this.actor) return;

      attack.applyStrengthDamageDiceMod(this.actor);

      if (this.data.data.tags.includes(TAGS.skillDamageBonus))
        attack.applySkillDamageDiceMod(this.actor);
    });

    this.data.data.ranges.applySizeCategoryReachBonus(this.actor);
  }
}

export default interface Weapon {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.WEAPON;
    _source: { type: typeof TYPES.ITEM.WEAPON };
  };
}

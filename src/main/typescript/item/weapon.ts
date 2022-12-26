import { TAGS, TYPES } from "../constants.js";
import { AttacksProperties } from "../data/item/weapon/attack/properties.js";
import { WeaponDataPropertiesData } from "../data/item/weapon/properties.js";
import { RangesProperties } from "../data/item/weapon/ranges/properties.js";
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
    this.data.data = WeaponDataPropertiesData.from(this.data.data, this);
  }

  override finalizeData(): void {
    if (!this.actor) {
      LOG.warn(
        `Trying to finalize a weapon without a parent actor. ${this.ident}`
      );
    }

    if (this.data.data.tags.includes(TAGS.skillDamageBonus))
      AttacksProperties.applySkillDamageDiceMod(
        this.data.data.attacks,
        this.actor,
        this
      );

    AttacksProperties.applyStrengthDamageDiceMod(
      this.data.data.attacks,
      this.actor
    );

    RangesProperties.applySizeCategoryReachBonus(
      this.data.data.ranges,
      this.actor
    );
  }
}

export default interface Weapon {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.WEAPON;
    _source: { type: typeof TYPES.ITEM.WEAPON };
  };
}

import { TAGS, TYPES } from "../constants.js";
import { AttacksProperties } from "../data/item/weapon/attack/properties.js";
import { LOG } from "../systemLogger.js";
import WvItem from "./wvItem.js";

/** An Item that can represent a weapon in the Wasteland Ventures system. */
export default class Weapon extends WvItem<"weapon"> {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.WEAPON)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.WEAPON}.`);

    super(data, context);
  }

  override finalizeData(): void {
    if (!this.actor) {
      LOG.warn(
        `Trying to finalize a weapon without a parent actor. ${this.ident}`
      );
    }

    if (this.system.tags.includes(TAGS.skillDamageBonus))
      AttacksProperties.applySkillDamageDiceMod(this.system.attacks, this.actor, this)

    AttacksProperties.applyStrengthDamageDiceMod(this.system.attacks, this.actor);
    this.system.ranges.applySizeCategoryReachBonus(this.actor);
  }
}

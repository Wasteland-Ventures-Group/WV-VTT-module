import { extraPotency, TYPES } from "../constants.js";
import { LevelingProperties } from "../data/actor/character/leveling/properties.js";
import { LOG } from "../systemLogger.js";
import WvItem from "./wvItem";

/** An Item that can represent a spell of any school and type. */
export default class Magic extends WvItem<"magic"> {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.MAGIC)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.MAGIC}.`);

    super(data, context);
  }

  override finalizeData(): void {
    if (!this.actor) {
      LOG.warn(
        `Trying to finalise a magic item without a parent actor. ${this.ident}`
      );
      return;
    }
    const actorData = this.actor.system;
    const relevantSpecialName = actorData.magic.magicSpecials[this.system.school];
    const relevantSpecialValue =
      actorData.specials[relevantSpecialName].tempTotal;
    this.system.potency.source =
      LevelingProperties.level(actorData.leveling) + extraPotency(relevantSpecialValue);
  }
}

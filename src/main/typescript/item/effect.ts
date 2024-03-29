import { TYPES } from "../constants.js";
import { EffectDataPropertiesData } from "../data/item/effect/properties.js";
import WvItem from "./wvItem.js";

/** An Item that can represent an arbitrary effect, using RuleElements. */
export default class Effect extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.EFFECT)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.EFFECT}.`);

    super(data, context);
  }

  override prepareBaseData(): void {
    this.data.data = new EffectDataPropertiesData(this.data.data, this);
  }
}

export default interface Effect {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.EFFECT;
    _source: { type: typeof TYPES.ITEM.EFFECT };
  };
}

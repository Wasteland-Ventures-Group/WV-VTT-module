import { TYPES } from "../constants.js";
import type EffectDataProperties from "../data/item/effect/properties.js";
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

  /** Get the system data of this effect. */
  get systemData(): EffectDataProperties["data"] {
    if (!this.data || this.data.type !== TYPES.ITEM.EFFECT)
      throw new Error(`This data's data type is not ${TYPES.ITEM.EFFECT}.`);

    return this.data.data;
  }

  override prepareBaseData(): void {
    this.data.data = new EffectDataPropertiesData(this.systemData, this);
  }
}

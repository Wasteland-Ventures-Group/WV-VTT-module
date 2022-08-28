import { TYPES } from "../constants.js";
import { RaceDataPropertiesData } from "../data/item/race/properties.js";
import WvItem from "./wvItem.js";

/** An Item that can represent a race in the system. */
export default class Race extends WvItem {
  /** This constructor enforces that instances have the correct data type. */
  constructor(
    data: ConstructorParameters<typeof Item>[0],
    context: ConstructorParameters<typeof Item>[1]
  ) {
    if (!data || data.type !== TYPES.ITEM.RACE)
      throw new Error(`The passed data's type is not ${TYPES.ITEM.RACE}.`);

    super(data, context);
  }

  override prepareBaseData(): void {
    this.data.data = new RaceDataPropertiesData(this.data.data, this);
  }
}

export default interface Race {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.RACE;
    _source: { type: typeof TYPES.ITEM.RACE };
  };
}

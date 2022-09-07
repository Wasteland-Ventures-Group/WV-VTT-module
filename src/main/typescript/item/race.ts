import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";
import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData.js";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs/baseUser.js";
import WvActor from "../actor/wvActor.js";
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

  /** Whether this race can fly */
  get canFly(): boolean {
    return this.data.data.physical.canFly;
  }

  /** Whether this race can use some form of magic */
  get canUseMagic(): boolean {
    return this.data.data.physical.canUseMagic;
  }

  /** Whether this race has a second head */
  get hasSecondHead(): boolean {
    return this.data.data.physical.hasSecondHead;
  }

  /** Whether this race has a Special Talent */
  get hasSpecialTalent(): boolean {
    return this.data.data.physical.hasSpecialTalent;
  }

  /** Whether this race has wings */
  get hasWings(): boolean {
    return this.data.data.physical.hasWings;
  }

  override prepareBaseData(): void {
    this.data.data = new RaceDataPropertiesData(this.data.data, this);
  }

  protected override async _preCreate(
    data: ItemDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preCreate(data, options, user);
    await this.removeRacesFromParent();
  }

  /** Check if there is a parent and remove existing races from them. */
  protected async removeRacesFromParent() {
    if (!(this.parent instanceof WvActor)) return;

    await this.parent.removeAllRaces();
  }
}

export default interface Race {
  data: foundry.data.ItemData & {
    type: typeof TYPES.ITEM.RACE;
    _source: { type: typeof TYPES.ITEM.RACE };
  };
}

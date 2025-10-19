import WvActor from "../actor/wvActor.js";
import { TYPES } from "../constants.js";
import WvItem from "./wvItem.js";

/** An Item that can represent a race in the system. */
export default class Race extends WvItem<"race"> {
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
    return this.system.physical.canFly;
  }

  /** Whether this race can use some form of magic */
  get canUseMagic(): boolean {
    return this.system.physical.canUseMagic;
  }

  /** Whether this race has a second head */
  get hasSecondHead(): boolean {
    return this.system.physical.hasSecondHead;
  }

  /** Whether this race has a Special Talent */
  get hasSpecialTalent(): boolean {
    return this.system.physical.hasSpecialTalent;
  }

  /** Whether this race has wings */
  get hasWings(): boolean {
    return this.system.physical.hasWings;
  }

  /**
   * How many SPECIAL points can be spent with this race at character creation
   */
  get creationSpecialPoints(): number {
    return this.system.creation.startingSpecialPoints;
  }

  protected override async _preCreate(
    data: Item.CreateData,
    options: Item.Database.PreCreateOptions,
    user: User.Implementation,
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

import { WvActorDerivedData } from "./../data/actorData.js";
import { WvActorDbData } from "./../data/actorDbData.js";
import WvItem from "./../item/wvItem.js";

/**
 * The basic Wasteland Ventures Actor.
 */
export default class WvActor extends Actor<
  WvActorDbData,
  WvItem,
  WvActorDerivedData
> {
  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  prepareBaseData() {
    this.computeBaseSecondaryStatistics();
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  prepareDerivedData() {
    this.applySizeModifiers();
  }

  /**
   * Compute and set the Actor's base secondary statistics.
   */
  protected computeBaseSecondaryStatistics(): void {
    this.data.data.leveling.level = this.computeLevel();
    this.data.data.vitals.maxHitPoints = this.computeBaseMaxHitPoints();
    this.data.data.vitals.healingRate = this.computeBaseHealingRate();
    this.data.data.vitals.maxActionPoints = this.computedBaseMaxActionPoints();
    this.data.data.vitals.maxStrain = this.computeBaseMaxStrain();
    this.data.data.leveling.maxSkillPoints = this.computeBaseMaxSkillPoints();
    this.data.data.vitals.maxInsanity = this.computeBaseMaxInsanity();
    this.data.data.secondary.maxCarryWeight = this.computeBaseMaxCarryWeight();
  }

  /**
   * Compute the base healing rate of the actor.
   */
  protected computeBaseHealingRate(): number {
    if (this.data.data.specials.endurance >= 8) {
      return 3;
    } else if (this.data.data.specials.endurance >= 4) {
      return 2;
    } else {
      return 1;
    }
  }

  /**
   * Compute the level of the Actor.
   */
  protected computeLevel(): number {
    return Math.floor(
      (1 + Math.sqrt(this._data.data.leveling.experience / 12.5 + 1)) / 2
    );
  }

  /**
   * Compute the base maximum action points of the Actor.
   */
  protected computedBaseMaxActionPoints(): number {
    return Math.floor(this.data.data.specials.agility / 2) + 10;
  }

  /**
   * Compute the base maximum carry weight of the Actor in kg.
   */
  protected computeBaseMaxCarryWeight(): number {
    return this.data.data.specials.strength * 5 + 10;
  }

  /**
   * Compute the base maximum health of the Actor.
   */
  protected computeBaseMaxHitPoints(): number {
    return this.data.data.specials.endurance + 10;
  }

  /**
   * Compute the base maximum insanity of the Actor.
   */
  protected computeBaseMaxInsanity(): number {
    return Math.floor(this.data.data.specials.intelligence / 2) + 5;
  }

  /**
   * Compute the base maximum skill points of the Actor.
   */
  protected computeBaseMaxSkillPoints(): number {
    return this._data.data.leveling.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  /**
   * Compute the base maximum strain of the Actor. This should be called after
   * the level of the Actor has been computed.
   */
  protected computeBaseMaxStrain(): number {
    if (this.data.data.leveling.level === undefined) {
      throw "The level should be computed before computing strain.";
    }
    return 20 + Math.floor(this.data.data.leveling.level / 5) * 5;
  }

  /**
   * Apply the stat modifiers, based on the size category of the Actor.
   * @throws if max hit points or max carry weight are not defined
   */
  protected applySizeModifiers(): void {
    if (
      this.data.data.vitals.maxHitPoints === undefined ||
      this.data.data.secondary.maxCarryWeight === undefined
    ) {
      throw "Max hit points and carry weight should be computed before size modifiers";
    }

    // TODO: hit chance, reach, combat trick mods
    switch (this.data.data.background.size) {
      case 4:
        this.data.data.vitals.maxHitPoints += 4;
        this.data.data.secondary.maxCarryWeight += 60;
        break;
      case 3:
        this.data.data.vitals.maxHitPoints += 2;
        this.data.data.secondary.maxCarryWeight += 40;
        break;
      case 2:
        this.data.data.vitals.maxHitPoints += 1;
        this.data.data.secondary.maxCarryWeight += 10;
        break;
      case 1:
        this.data.data.secondary.maxCarryWeight += 5;
        break;
      case -1:
        this.data.data.secondary.maxCarryWeight -= 5;
        break;
      case -2:
        this.data.data.vitals.maxHitPoints -= 1;
        this.data.data.secondary.maxCarryWeight -= 10;
        break;
      case -3:
        this.data.data.vitals.maxHitPoints -= 2;
        this.data.data.secondary.maxCarryWeight -= 40;
        break;
      case -4:
        this.data.data.vitals.maxHitPoints -= 4;
        this.data.data.secondary.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }
  }
}

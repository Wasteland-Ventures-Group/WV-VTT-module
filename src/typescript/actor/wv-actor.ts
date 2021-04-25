import { WvActorDerivedData } from "./../data/actor-data";
import { WvActorDbData } from "./../data/actor-db-data";
import { WvItem } from "./../item/wv-item";

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
  prepareBaseData(): void {
    this.computeBaseSecondaryStatistics();
  }

  /**
   * @override
   */
  prepareDerivedData(): void {
    this.applySizeModifiers();
  }

  /**
   * Compute and set the Actor's base secondary statistics.
   */
  protected computeBaseSecondaryStatistics(): void {
    this.data.data.level = this.computeLevel();
    this.data.data.maxHitPoints = this.computeBaseMaxHitPoints();
    this.data.data.healingRate = this.computeBaseHealingRate();
    this.data.data.maxActionPoints = this.computedBaseMaxActionPoints();
    this.data.data.maxStrain = this.computeBaseMaxStrain();
    this.data.data.maxSkillPoints = this.computeBaseMaxSkillPoints();
    this.data.data.maxInsanity = this.computeBaseMaxInsanity();
    this.data.data.maxCarryWeight = this.computeBaseMaxCarryWeight();
  }

  /**
   * Compute the base healing rate of the actor.
   */
  protected computeBaseHealingRate(): number {
    if (this.data.data.endurance >= 8) {
      return 3;
    } else if (this.data.data.endurance >= 4) {
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
      (1 + Math.sqrt(this._data.data.experience / 12.5 + 1)) / 2
    );
  }

  /**
   * Compute the base maximum action points of the Actor.
   */
  protected computedBaseMaxActionPoints(): number {
    return Math.floor(this.data.data.agility / 2) + 10;
  }

  /**
   * Compute the base maximum carry weight of the Actor in kg.
   */
  protected computeBaseMaxCarryWeight(): number {
    return this.data.data.strenght * 5 + 10;
  }

  /**
   * Compute the base maximum health of the Actor.
   */
  protected computeBaseMaxHitPoints(): number {
    return this.data.data.endurance + 10;
  }

  /**
   * Compute the base maximum insanity of the Actor.
   */
  protected computeBaseMaxInsanity(): number {
    return Math.floor(this.data.data.intelligence / 2) + 5;
  }

  /**
   * Compute the base maximum skill points of the Actor.
   */
  protected computeBaseMaxSkillPoints(): number {
    return this._data.data.levelIntelligences.reduce(
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
    return 20 + Math.floor(this.data.data.level / 5) * 5;
  }

  /**
   * Apply the stat modifiers, based on the size category of the Actor.
   */
  protected applySizeModifiers(): void {
    // TODO: hit chance, reach, combat trick mods
    switch (this.data.data.size) {
      case 4:
        this.data.data.maxHitPoints += 4;
        this.data.data.maxCarryWeight += 60;
        break;
      case 3:
        this.data.data.maxHitPoints += 2;
        this.data.data.maxCarryWeight += 40;
        break;
      case 2:
        this.data.data.maxHitPoints += 1;
        this.data.data.maxCarryWeight += 10;
        break;
      case 1:
        this.data.data.maxCarryWeight += 5;
        break;
      case -1:
        this.data.data.maxCarryWeight -= 5;
        break;
      case -2:
        this.data.data.maxHitPoints -= 1;
        this.data.data.maxCarryWeight -= 10;
        break;
      case -3:
        this.data.data.maxHitPoints -= 2;
        this.data.data.maxCarryWeight -= 40;
        break;
      case -4:
        this.data.data.maxHitPoints -= 4;
        this.data.data.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }
  }
}

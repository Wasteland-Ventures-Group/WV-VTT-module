import { PlayerCharacterData } from '../types/actor';

/**
 * The basic Wasteland Ventures Actor.
 */
export default class WvActor extends Actor<PlayerCharacterData> {
  /**
   * @override
   */
  prepareBaseData(): void {
    // TODO This needs to be changed. Somehow we need to add derived only data
    // members to the Actor data without those bein saved to the database.
    this.data.data.hitPoints = this.computeBaseMaxHealth();
  }

  /**
   * Compute the base max health, depending on the Endurance in
   * {@link Entity._data}.
   */
  protected computeBaseMaxHealth(): number {
    return this._data.data.endurance + 10;
  }
}

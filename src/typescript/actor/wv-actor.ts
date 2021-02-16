import { PlayerCharacterData } from '../types/actor';

/**
 * The basic Wasteland Ventures Actor.
 */
export default class WvActor extends Actor<PlayerCharacterData> {
  prepareBaseData(): void {
    this._prepareBaseMaxHealth();
  }

  // = private base data preparation methods ===================================

  /**
   * Set the max health in `data` from the values in `_data`.
   */
  _prepareBaseMaxHealth(): void {
    this.data.data.hitPoints = this._data.data.endurance + 10;
  }
}

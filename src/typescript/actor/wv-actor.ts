/**
 * The basic Wasteland Ventures Actor.
 */
export default class WvActor extends Actor {
  prepareBaseData () {
    this._prepareBaseMaxHealth()
  }

  // = private base data preparation methods ===================================

  /**
   * Set the max health in `data` from the values in `_data`.
   */
  _prepareBaseMaxHealth () {
    this.data.secondary.health.max = 10 + this._data.special.endurance.value
  }
}

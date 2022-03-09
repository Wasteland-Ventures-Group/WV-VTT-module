import { getGame } from "../foundryHelpers.js";
import { LOG } from "../systemLogger.js";

export default class WvCombat extends Combat {
  /**
   * Check whether this combat counts as globally active, no matter which scene
   * the current user is viewing.
   */
  get isGloballyActive(): boolean {
    return (
      (typeof this.data.scene !== "string" ||
        getGame().scenes?.active?.id === this.data.scene) &&
      this.started
    );
  }

  override async nextRound(): Promise<this | undefined> {
    this.resetActionPoints();
    return super.nextRound();
  }

  override async startCombat(): Promise<this | undefined> {
    this.resetActionPoints();
    return super.startCombat();
  }

  /** Reset the action points of all combatants to their max value. */
  private resetActionPoints() {
    this.combatants.forEach((combatant) => {
      if (!combatant.actor) {
        LOG.debug(`The combatant has no actor. id=${combatant.id}`);
        return;
      }
      if (typeof combatant.actor.actionPoints.max !== "number") {
        LOG.debug(
          `The combatant actor's max action points is undefined. id=${combatant.id}`
        );
        return;
      }
      if (combatant.data.defeated) return;

      combatant.actor.updateActionPoints(combatant.actor.actionPoints.max);
    });
  }
}

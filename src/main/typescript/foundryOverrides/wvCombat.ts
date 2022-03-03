import { LOG } from "../systemLogger.js";

export default class WvCombat extends Combat {
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

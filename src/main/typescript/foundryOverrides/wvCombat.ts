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
    this.restoreCombatantsActionPoints(true);
    return super.nextRound();
  }

  override async startCombat(): Promise<this | undefined> {
    this.restoreCombatantsActionPoints(true);
    return super.startCombat();
  }

  override async endCombat(): Promise<WvCombat | undefined> {
    const result = await super.endCombat();
    if (!result) return;

    this.restoreCombatantsActionPoints();
    this.restoreCombatantsQuickSlots();

    return result;
  }

  /**
   * Reset the action points of all combatants to their max value.
   *
   * @param inCombat - whether to also restore action points of actors in combat
   */
  private restoreCombatantsActionPoints(inCombat = false) {
    this.combatants.forEach((combatant) => {
      if (combatant.data.defeated) return;

      if (!combatant.actor) {
        LOG.debug(`The combatant has no actor. id=${combatant.id}`);
        return;
      }

      if (!inCombat && combatant.actor.inCombat) return;

      combatant.actor.restoreActionPoints();
    });
  }

  /**
   * Restore the quick slots of all combatants to their max value.
   *
   * @param inCombat - whether to also restore quick slots of actors in combat
   */
  private restoreCombatantsQuickSlots(inCombat = false) {
    this.combatants.forEach((combatant) => {
      if (combatant.data.defeated) return;

      if (!combatant.actor) {
        LOG.debug(`The combatant has no actor. id=${combatant.id}`);
        return;
      }

      if (!inCombat && combatant.actor.inCombat) return;

      combatant.actor.restoreQuickSlots();
    });
  }
}

export default class WvCombat extends Combat {
  /** @override */
  async nextRound(): Promise<this | undefined> {
    this.resetActionPoints();
    return super.nextRound();
  }

  /** @override */
  async startCombat(): Promise<this | undefined> {
    this.resetActionPoints();
    return super.startCombat();
  }

  /** Reset the action points of all combatants to their max value. */
  private resetActionPoints() {
    this.combatants.forEach((c) => {
      if (!c.actor) {
        console.debug(`The combatant has no actor. id=${c.id}`);
        return;
      }
      c.actor.update({
        _id: c.actor.id,
        data: { vitals: { actionPoints: { value: c.actor.actionPoints.max } } }
      });
    });
  }
}

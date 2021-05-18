import WvActor, { UpdateData as WvActorUpdateData } from "../actor/wvActor.js";
import { WvActorDbData } from "../data/actorDbData.js";

export class WvCombat extends Combat {
  /** @override */
  async nextRound(): Promise<void> {
    this.resetActionPoints();
    return super.nextRound();
  }

  /** @override */
  async startCombat(): Promise<this> {
    this.resetActionPoints();
    return super.startCombat();
  }

  /** Reset the action points of all combatants to their max value. */
  private async resetActionPoints() {
    const updateData: WvActorUpdateData[] = [];

    this.combatants.forEach((combatant) => {
      if (combatant.token?.actorLink) {
        updateData.push(this.createLinkedActorUpdateData(combatant));
      } else {
        this.updateTokenActor(combatant);
      }
    });

    return await WvActor.update(updateData);
  }

  /**
   * Create update data to reset a passed combatant's linked actor's action
   * points to the max.
   * @param combatant - the combatant to update the actor for
   * @returns the update data
   */
  private createLinkedActorUpdateData(
    combatant: DeepPartial<Combat.Combatant>
  ): WvActorUpdateData {
    if (!(combatant.actor instanceof WvActor))
      throw `The combatant actor is no a WvActor! id="${combatant.actor?.id}"`;
    if (!combatant.actor.actionPoints.max)
      throw "The actor has no max action points!";

    return combatant.actor.updateActionPoints(
      combatant.actor.actionPoints.max,
      false
    );
  }

  /**
   * Reset the action points to their max for the passed combatant's associated,
   * unlinked token actor.
   * @param combatant - the combatant whose actor to update
   */
  private updateTokenActor(combatant: DeepPartial<Combat.Combatant>) {
    if (!game.actors) throw "The game has no actors collection!";
    if (!combatant.tokenId) throw "The combatant has no token ID!";
    if (!(combatant.actor instanceof WvActor))
      throw `The combatant actor is no a WvActor! id="${combatant.actor?.id}"`;

    const tokenActor = game.actors.tokens[combatant.tokenId];
    if (!tokenActor) {
      console.warn(
        `Could not find a token actor for the combatant. tokenId="${combatant.tokenId}"`
      );
      return;
    }

    const updateData: DeepPartial<WvActorDbData> = {
      data: {
        vitals: {
          actionPoints: { value: combatant.actor.actionPoints.max }
        }
      }
    };

    tokenActor.update(updateData);
  }
}

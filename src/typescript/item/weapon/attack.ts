import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import { getGame } from "../../foundryHelpers.js";
import type Weapon from "../weapon.js";

/**
 * An attack of a Weapon Item.
 */
export default class Attack {
  /**
   * Create an Attack from the given data.
   * @param data - the attack source data
   * @param weapon - the Weapon this Attack belongs to
   */
  constructor(public data: AttackSource, public weapon: Weapon) {}

  /**
   * Execute the attack
   */
  execute(): void {
    if (!(this.weapon.actor instanceof WvActor)) return;

    const msgOptions: ChatMessageDataConstructorData = {
      speaker: ChatMessage.getSpeaker({ actor: this.weapon.actor })
    };

    const currentAp = this.weapon.actor.data.data.vitals.actionPoints.value;
    const apUse = this.data.ap;

    if (currentAp < apUse) {
      ChatMessage.create(
        foundry.utils.mergeObject(msgOptions, {
          content: `${this.header}<p>${getGame().i18n.localize(
            "wv.weapons.attacks.notEnoughAp"
          )}</p>`
        })
      );
      return;
    }

    this.weapon.actor.updateActionPoints(currentAp - apUse);

    ChatMessage.create(
      foundry.utils.mergeObject(msgOptions, {
        content: this.header + this.body
      })
    );
  }

  /**
   * Create the header for the chat message.
   */
  private get header(): string {
    return this.weapon.name
      ? `<h3>${this.weapon.name}</h3>
<h4>${this.weapon.data.data.name}</h3>`
      : `<h3>${this.weapon.data.data.name}</h3>`;
  }

  private get body(): string {
    const weaponData = this.weapon.systemData;

    const ranges = [
      weaponData.ranges.short.distance,
      weaponData.ranges.medium.distance,
      weaponData.ranges.long.distance
    ];

    const loc = getGame().i18n.localize;

    return `<p>${loc("wv.weapons.attacks.hitRoll")}: [[1d100cs<=@skills.${
      weaponData.skill
    }.total]]</p>
<p>${loc("wv.weapons.attacks.damageRoll")}: [[(${this.data.damage.dice}d6) + ${
      this.data.damage.base
    }]]</p>
<ul>
  <li>${loc("wv.weapons.attacks.range")}: ${ranges.join("/")}</li>
</ul>`;
  }
}

/** The Attack raw data layout */
export interface AttackSource {
  /** A name for the attack */
  name: string;

  /** Notes or a description of the attack */
  description: string;

  /** The values related to the damage the weapon causes */
  damage: {
    /** The base damage amount */
    base: number;

    /** The number of d6 to throw for variable damage */
    dice: number;

    /** Whether the die property is the minimum value of a die range */
    diceRange: boolean;
  };

  /** The amount of rounds used with the attack */
  rounds: number;

  /** The damage threshold reduction of the attack */
  dtReduction: number;

  /** The splash radius */
  splash: unknown; // TODO: implement an enum or similar

  /** The amount of action points needed to attack */
  ap: number;
}

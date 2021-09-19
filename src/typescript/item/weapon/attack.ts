import RollModifierDialog from "../../applications/rollModifierDialog.js";
import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import { getGame } from "../../foundryHelpers.js";
import type Weapon from "../weapon.js";
import Formulator from "../../formulator.js";
import type DragData from "../../dragData.js";

/**
 * An attack of a Weapon Item.
 */
export default class Attack {
  /**
   * Create an Attack from the given data.
   * @param name - the identifier name of the attack
   * @param data - the attack source data
   * @param weapon - the Weapon this Attack belongs to
   */
  constructor(
    public name: string,
    public data: AttackSource,
    public weapon: Weapon
  ) {}

  /**
   * Execute the attack
   * @param options - options for the roll
   */
  execute(options: RollOptions = {}): void {
    if (!(this.weapon.actor instanceof WvActor)) return;

    const msgOptions: ChatMessageDataConstructorData = {
      speaker: ChatMessage.getSpeaker({ actor: this.weapon.actor })
    };
    if (options?.whisperToGms) {
      msgOptions["whisper"] = ChatMessage.getWhisperRecipients("gm");
    }

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

    new RollModifierDialog(
      (range) => {
        ChatMessage.create(
          foundry.utils.mergeObject(msgOptions, {
            content: this.header + this.getBody(range, options?.modifier)
          })
        );
      },
      {
        description: getGame().i18n.localize("wv.rolls.rangeDescription"),
        min: 0
      }
    ).render(true);
  }

  /**
   * Get the system formula representation of the damage of this attack.
   */
  get damageFormula(): string {
    return `${this.data.damage.base}+(${this.getDamageDice(0)})`;
  }

  /**
   * Get the amount of damage d6 of this attack. If the attack has a damage
   * range, this includes the Strength based bonus dice of the owning actor. If
   * the attack is made with a damage fall-off, this is also taken into account.
   * @param range - the range to the target
   * @returns the effective amount of damage dice
   */
  getDamageDice(range: number): number {
    let dice = this.data.damage.dice;

    if (this.data.damage.diceRange) {
      if (!this.weapon.actor) throw "The owning weapon has no actor!";

      const str = this.weapon.actor.data.data.specials.strength;

      if (str > 10) {
        dice += 3;
      } else if (str >= 8) {
        dice += 2;
      } else if (str >= 4) {
        dice += 1;
      }
    }

    if (this.data.damage.damageFallOff === "shotgun") {
      const short = this.weapon.systemData.ranges.short;
      const medium = this.weapon.systemData.ranges.medium;

      const shortDistance = this.weapon.getEffectiveRangeDistance(
        short.distance
      );

      let mediumDistance;
      if (medium !== "unused") {
        mediumDistance = this.weapon.getEffectiveRangeDistance(medium.distance);
      }

      if (typeof mediumDistance === "number" && range > mediumDistance) {
        dice -= 4;
      } else if (range > shortDistance) {
        dice -= 2;
      }
    }

    return dice > 0 ? dice : 0;
  }

  /**
   * Create the header for the chat message.
   */
  private get header(): string {
    const hasCustomName = this.weapon.name !== this.weapon.data.data.name;
    const heading = hasCustomName
      ? this.weapon.name
      : this.weapon.data.data.name;

    const subHeading = hasCustomName
      ? `${this.weapon.data.data.name} - ${this.name}`
      : this.name;

    return `<h3>${heading}</h3><h4>${subHeading}</h4>`;
  }

  /**
   * Create the body for the chat message.
   * @param range - the range to the target
   * @param modifier - an optional hit target modifier
   */
  private getBody(range: number, modifier?: number): string {
    if (!this.weapon.actor) throw "The owning weapon has no actor!";

    const weaponData = this.weapon.systemData;
    const skillTotal =
      this.weapon.actor.data.data.skills[weaponData.skill]?.total;
    if (!skillTotal)
      throw "The owning actor's skills have not been calculated!";

    const ranges = [weaponData.ranges.short.distance];
    if (weaponData.ranges.medium !== "unused")
      ranges.push(weaponData.ranges.medium.distance);
    if (weaponData.ranges.long !== "unused")
      ranges.push(weaponData.ranges.long.distance);
    const displayRanges = ranges
      .map((range) => this.weapon.getEffectiveRangeDistance(range))
      .join("/");

    return `<p>${this.weapon.data.data.notes}</p>
<p>${getGame().i18n.localize(
      "wv.weapons.attacks.hitRoll"
    )}: [[${Formulator.skill(skillTotal).modify(modifier)}]]</p>
<p>${getGame().i18n.localize(
      "wv.weapons.attacks.damageRoll"
    )}: [[(${this.getDamageDice(range)}d6) + ${this.data.damage.base}]]</p>
<ul>
  <li>${getGame().i18n.localize(
    "wv.weapons.attacks.range"
  )}: ${displayRanges}</li>
</ul>`;
  }
}

/** The Attack raw data layout */
export interface AttackSource {
  /** The values related to the damage the weapon causes */
  damage: {
    /** The base damage amount */
    base: number;

    /** The number of d6 to throw for variable damage */
    dice: number;

    /** Whether the die property is the minimum value of a die range */
    diceRange: boolean;

    /** The type of damage fall-off for the attack */
    damageFallOff: DamageFallOff;
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

/** A type representing different damage fall-off rules */
type DamageFallOff = "shotgun" | "none";

/** The drag data of a Weapon Attack */
export interface WeaponAttackDragData extends DragData {
  /** The ID of the Actor, owning the Weapon */
  actorId: string;

  /** The name of the Attack on the Weapon */
  attackName: string;

  type: "weaponAttack";

  /** The ID of the Weapon on the Actor */
  weaponId: string;
}

/**
 * A custom typeguard, to check whether an unknown object is a
 * WeaponAttackDragData.
 * @param data - the unknown object
 * @returns whether it is a WeaponAttackDragData
 */
export function isWeaponAttackDragData(
  data: Record<string, unknown>
): data is WeaponAttackDragData {
  return (
    data.type === "weaponAttack" &&
    typeof data.actorId === "string" &&
    typeof data.attackName === "string" &&
    typeof data.weaponId === "string"
  );
}

/**
 * Options for modifying Attack rolls.
 */
interface RollOptions {
  /**
   * An ad-hoc modifier to roll with. When undefined, no modifier is applied.
   * @defaultValue `undefined`
   */
  modifier?: number;

  /**
   * Whether to whisper the Attack to GMs.
   * @defaultValue `false`
   */
  whisperToGms?: boolean;
}

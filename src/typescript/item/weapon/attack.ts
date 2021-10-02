import Prompt from "../../applications/prompt.js";
import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import { getGame } from "../../foundryHelpers.js";
import type Weapon from "../weapon.js";
import Formulator from "../../formulator.js";
import type DragData from "../../dragData.js";
import { CONSTANTS } from "../../constants.js";
import type { WeaponAttackFlags } from "../../hooks/renderChatMessage/decorateSystemMessage/decorateWeaponAttack.js";
import {
  getRangeBracket,
  getRangeModifier,
  RangeBracket
} from "../../data/item/weapon/ranges.js";
import { getSpecialMaxPoints, getSpecialMinPoints } from "../../helpers.js";
import diceSoNice from "../../integrations/diceSoNice/diceSoNice.js";

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
  async execute(options: RollOptions = {}): Promise<void> {
    if (!(this.weapon.actor instanceof WvActor)) return;

    const skillTotal =
      this.weapon.actor.data.data.skills[this.weapon.systemData.skill]?.total;
    if (typeof skillTotal !== "number")
      throw new Error("The owning actor's skills have not been calculated!");

    const range = await Prompt.getNumber({
      description: getGame().i18n.localize("wv.prompt.descriptions.range"),
      min: 0
    });

    const rangeBracket = getRangeBracket(
      this.weapon.systemData.ranges,
      range,
      this.weapon.actor?.data.data.specials
    );
    if (rangeBracket === RangeBracket.OUT_OF_RANGE) {
      this.createOutOfRangeMessage(this.weapon.actor, options);
      return;
    }

    if (
      this.weapon.actor.getActiveTokens(true).some((token) => token.inCombat)
    ) {
      const currentAp = this.weapon.actor.data.data.vitals.actionPoints.value;
      const apUse = this.data.ap;
      if (currentAp < apUse) {
        this.createNotEnoughApMessage(this.weapon.actor, options);
        return;
      }
      this.weapon.actor.updateActionPoints(currentAp - apUse);
    }

    const rangeModifier = getRangeModifier(
      this.weapon.systemData.ranges,
      rangeBracket
    );

    const hitRoll = new Roll(
      Formulator.skill(skillTotal)
        .modify(rangeModifier + (options.modifier ?? 0))
        .criticals(this.weapon.actor.data.data.secondary.criticals)
        .toString()
    ).evaluate({ async: false });

    const damageDice = this.getDamageDice(
      rangeBracket,
      this.weapon.actor.data.data.specials.strength
    );
    const damageRoll = new Roll(
      Formulator.damage(this.data.damage.base, damageDice).toString()
    ).evaluate({ async: false });

    this.createAttackMessage(this.weapon.actor, hitRoll, damageRoll, options);
  }

  /** Get the system formula representation of the damage of this attack. */
  get damageFormula(): string {
    const base = this.data.damage.base;
    let dice: string;
    if (this.data.damage.diceRange) {
      if (this.weapon.actor) {
        dice = this.getDamageDice(
          RangeBracket.SHORT,
          this.weapon.actor.data.data.specials.strength
        ).toString();
      } else {
        const low = this.getDamageDice(
          RangeBracket.SHORT,
          getSpecialMinPoints()
        );
        const high = this.getDamageDice(
          RangeBracket.SHORT,
          getSpecialMaxPoints()
        );
        dice = `${low}-${high}`;
      }
    } else {
      dice = this.getDamageDice(RangeBracket.SHORT).toString();
    }
    return `${base}+(${dice})`;
  }

  /**
   * Get the amount of damage d6 of this attack. If the attack has a damage
   * range, this includes the Strength based bonus dice of the owning actor. If
   * the attack is made with a damage fall-off, this is also taken into account.
   * @param range - the range to the target
   * @param strength - the Strength of the owning actor
   * @returns the effective amount of damage dice
   */
  getDamageDice(range: RangeBracket, strength?: number | undefined): number {
    let dice = this.data.damage.dice;

    if (this.data.damage.diceRange && typeof strength === "number") {
      dice += this.getStrengthDice(strength);
    }

    if (this.data.damage.damageFallOff === "shotgun") {
      switch (range) {
        case RangeBracket.LONG:
          dice -= 4;
          break;

        case RangeBracket.MEDIUM:
          dice -= 2;
          break;
      }
    }

    return dice > 0 ? dice : 0;
  }

  /** Get the Strength bonus dice for the given Strength value. */
  protected getStrengthDice(strength: number): number {
    if (strength > 10) {
      return 3;
    } else if (strength >= 8) {
      return 2;
    } else if (strength >= 4) {
      return 1;
    } else {
      return 0;
    }
  }

  protected createDefaultMessageData(
    actor: WvActor,
    options: RollOptions
  ): ChatMessageDataConstructorData {
    const data: ChatMessageDataConstructorData = {
      speaker: ChatMessage.getSpeaker({ actor }),
      flags: { [CONSTANTS.systemId]: this.defaultChatMessageFlags }
    };

    if (options?.whisperToGms) {
      data["whisper"] = ChatMessage.getWhisperRecipients("gm");
    }

    return data;
  }

  /** Get the default ChatMessage flags for this Weapon Attack. */
  protected get defaultChatMessageFlags(): WeaponAttackFlags {
    return {
      type: "weaponAttack",
      weaponName: this.weapon.data.name,
      weaponImage: this.weapon.img,
      weaponSystemData: this.weapon.systemData,
      attackName: this.name,
      executed: false
    };
  }

  protected createOutOfRangeMessage(
    actor: WvActor,
    options: RollOptions
  ): void {
    ChatMessage.create(
      foundry.utils.mergeObject(this.createDefaultMessageData(actor, options), {
        flags: {
          [CONSTANTS.systemId]: { executed: false, reason: "outOfRange" }
        }
      } as DeepPartial<ChatMessageDataConstructorData>)
    );
  }

  protected createNotEnoughApMessage(
    actor: WvActor,
    options: RollOptions
  ): void {
    ChatMessage.create(
      foundry.utils.mergeObject(this.createDefaultMessageData(actor, options), {
        flags: {
          [CONSTANTS.systemId]: { executed: false, reason: "insufficientAp" }
        }
      } as DeepPartial<ChatMessageDataConstructorData>)
    );
  }

  protected async createAttackMessage(
    actor: WvActor,
    hitRoll: Roll,
    damageRoll: Roll,
    options: RollOptions
  ): Promise<void> {
    const defaultData = this.createDefaultMessageData(actor, options);
    const whisperTargets = defaultData.whisper ?? null;
    const speaker = defaultData.speaker;

    await Promise.all([
      diceSoNice(hitRoll, whisperTargets, speaker),
      diceSoNice(damageRoll, whisperTargets, speaker)
    ]);

    ChatMessage.create(
      foundry.utils.mergeObject(defaultData, {
        flags: {
          [CONSTANTS.systemId]: {
            executed: true,
            ownerSpecials: actor.data.data.specials,
            rolls: {
              damage: {
                formula: damageRoll.formula,
                results: damageRoll.dice[0].results.map(
                  (result) => result.result
                ),
                total: damageRoll.total
              },
              hit: {
                critical: hitRoll.dice[0].results[0].critical,
                formula: hitRoll.formula,
                result: hitRoll.dice[0].results[0].result,
                total: hitRoll.total
              }
            }
          }
        }
      } as DeepPartial<ChatMessageDataConstructorData>)
    );
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

    /**
     * Whether the die property is the minimum value of a die range. By default
     * this is false.
     */
    diceRange?: boolean;

    /**
     * The type of damage fall-off for the attack. By default the attack has no
     * fall-off.
     */
    damageFallOff?: DamageFallOff;
  };

  /**
   * The amount of rounds used with the attack. By default the attack does not
   * consume rounds.
   */
  rounds?: number;

  /**
   * The damage threshold reduction of the attack. By default the attack has no
   * DT reduction.
   */
  dtReduction?: number;

  /** The splash radius. By default the attack has no splash. */
  splash?: unknown; // TODO: implement an enum or similar

  /** The amount of action points needed to attack */
  ap: number;
}

/** A type representing different damage fall-off rules */
type DamageFallOff = "shotgun";

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

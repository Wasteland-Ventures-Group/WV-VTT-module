import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import Prompt, {
  NumberInputSpec,
  TextInputSpec
} from "../../applications/prompt.js";
import { CONSTANTS } from "../../constants.js";
import type { CompositeNumber } from "../../data/common.js";
import type { AttackProperties } from "../../data/item/weapon/attack/properties.js";
import type DragData from "../../dragData.js";
import Formulator from "../../formulator.js";
import { getGame } from "../../foundryHelpers.js";
import type * as deco from "../../hooks/renderChatMessage/decorateSystemMessage/decorateWeaponAttack.js";
import diceSoNice from "../../integrations/diceSoNice/diceSoNice.js";
import * as interact from "../../interaction.js";
import { LOG } from "../../systemLogger.js";
import SystemRulesError from "../../systemRulesError.js";
import type Weapon from "../weapon.js";
import * as ranges from "./ranges.js";

/** An attack of a Weapon Item. */
export default class Attack {
  /**
   * Create an Attack from the given data.
   * @param name - the identifier name of the attack
   * @param data - the attack data
   * @param weapon - the Weapon this Attack belongs to
   */
  constructor(
    public name: string,
    public data: AttackProperties,
    public weapon: Weapon
  ) {}

  /**
   * Execute the attack
   * @param options - options for the roll
   */
  async execute(options: RollOptions = {}): Promise<void> {
    // Get owners and data -----------------------------------------------------
    let weapon = this.weapon;
    let token = interact.getFirstControlledToken();
    let actor = weapon.actor ?? interact.getActor(token);
    token ??= interact.getActorToken(actor);
    const target = interact.getFirstTarget();

    if (!actor)
      throw new SystemRulesError(
        "Can not execute a weapon attack without an actor!"
      );

    // Clone the weapon, so we can finalize it with the selected actor and other
    // external data.
    const originalActor = actor;
    actor = await actor.clone();
    if (!actor) {
      LOG.error("Could not clone the actor: ", originalActor);
      return;
    }

    const originalWeapon = weapon;
    const clonedWeapon = await weapon.clone({ parent: actor });
    if (!clonedWeapon) {
      LOG.error("Could not clone the weapon: ", originalWeapon);
      return;
    }
    weapon = clonedWeapon;

    // Only finalize, if the weapon hasn't already been finalized
    if (!this.weapon.actor) {
      weapon.finalizeData();
    }

    const attack = weapon.data.data.attacks.attacks[this.name];
    if (!attack) {
      LOG.error(`Could not find attack "${this.name}" on: `, weapon);
      return;
    }

    // Get needed external data ------------------------------------------------
    let externalData: ExternalData;
    try {
      externalData = await this.getExternalData(actor, token, target);
    } catch (e) {
      if (e === "closed") return;
      else throw e;
    }
    const { alias, modifier, range } = externalData;

    // Create common chat message data -----------------------------------------
    const commonData: ChatMessageDataConstructorData =
      this.createDefaultMessageData(
        {
          scene: null,
          actor: actor.id,
          token: token?.id ?? null,
          alias
        },
        options
      );

    // Get range bracket -------------------------------------------------------
    const rangeBracket = ranges.getRangeBracket(
      weapon.data.data.ranges,
      range,
      actor.data.data.specials
    );
    const isOutOfRange = ranges.RangeBracket.OUT_OF_RANGE === rangeBracket;
    attack.applyRangeDamageDiceMod(range);

    // Calculate hit roll target -----------------------------------------------
    const rangeModifier = ranges.getRangeModifier(
      weapon.data.data.ranges,
      rangeBracket
    );

    const critSuccess = actor.data.data.secondary.criticals.success;
    const critFailure = actor.data.data.secondary.criticals.failure;
    const hitChance = attack.getHitRollTarget(
      actor.data.data.skills[weapon.data.data.skill],
      rangeModifier,
      modifier,
      critSuccess.total,
      critFailure.total
    );

    // Calculate AP ------------------------------------------------------------
    const previousAp = actor.data.data.vitals.actionPoints.value;
    const remainingAp = isOutOfRange
      ? previousAp
      : token?.inCombat
      ? previousAp - this.data.ap.total
      : previousAp;
    const notEnoughAp = 0 > remainingAp;

    // Create common attack flags ----------------------------------------------
    const commonFlags: Required<deco.CommonWeaponAttackFlags> = {
      type: "weaponAttack",
      details: {
        ap: {
          cost: this.data.ap.total,
          previous: previousAp,
          remaining: remainingAp
        },
        criticals: {
          failure: critFailure.toObject(false),
          success: critSuccess.toObject(false)
        },
        damage: {
          base: this.data.damage.base.toObject(false),
          dice: this.data.damage.dice.toObject(false)
        },
        hit: hitChance.toObject(false),
        range: {
          bracket: rangeBracket,
          distance: range
        }
      },
      weapon: {
        display: {
          ranges: ranges.getDisplayRanges(
            this.weapon.data.data,
            actor.data.data.specials
          )
        },
        image: this.weapon.img,
        name: this.weapon.name,
        system: {
          attack: {
            name: this.name
          },
          name: this.weapon.data.name
        }
      }
    };

    // Check range -------------------------------------------------------------
    if (isOutOfRange) {
      this.createOutOfRangeMessage(commonData, commonFlags);
      return;
    }

    // Check AP and subtract in combat -----------------------------------------
    if (token?.inCombat) {
      if (notEnoughAp) {
        this.createNotEnoughApMessage(commonData, commonFlags);
        return;
      }
      actor?.updateActionPoints(remainingAp);
    }

    // Hit roll ----------------------------------------------------------------
    const hitRoll = new Roll(
      Formulator.skill(hitChance.total)
        .criticals({ success: critSuccess.total, failure: critFailure.total })
        .toString()
    ).evaluate({ async: false });

    // Damage roll -------------------------------------------------------------
    const damageRoll = new Roll(
      Formulator.damage(
        this.data.damage.base.total,
        this.data.damage.dice.total
      ).toString()
    ).evaluate({ async: false });

    // Create attack message ---------------------------------------------------
    this.createAttackMessage(commonData, commonFlags, hitRoll, damageRoll);
  }

  /** Get the system formula representation of the damage of this attack. */
  get damageFormula(): string {
    if (!this.data.damage.diceRange || this.weapon.actor)
      return `${this.data.damage.base.total}+(${this.data.damage.dice.total})`;

    const low =
      this.data.damage.dice.total +
      this.getStrengthDamageDiceMod(CONSTANTS.bounds.special.points.min);
    const high =
      this.data.damage.dice.total +
      this.getStrengthDamageDiceMod(CONSTANTS.bounds.special.points.max);
    return `${this.data.damage.base.total}+(${low}-${high})`;
  }

  /**
   * Get the string representation of the potential damage range of the attack.
   */
  get damageRange(): string {
    const low = this.data.damage.base.total;
    let high = low + this.data.damage.dice.total;

    if (this.data.damage.diceRange && !this.weapon.actor) {
      high += this.getStrengthDamageDiceMod(
        CONSTANTS.bounds.special.points.max
      );
    }

    return `${low} - ${high}`;
  }

  /**
   * Apply a Strength damage dice modifier to the attack, based on the Strength
   * of the given Actor.
   */
  applyStrengthDamageDiceMod(actor: WvActor): void {
    const value = this.getStrengthDamageDiceMod(
      actor.data.data.specials.strength.tempTotal
    );
    if (value)
      this.data.damage.dice.add({
        value,
        labelComponents: [
          { key: "wv.rules.special.names.strength.long" },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });
  }

  /**
   * Apply a skill damage dice modifier to the attack, based on the skill of
   * the weapon and the skill value of the given Actor.
   */
  applySkillfulDamageDiceMod(actor: WvActor): void {
    const value = this.getSkillfulDamageDiceMod(
      actor.data.data.skills[this.weapon.data.data.skill].total
    );
    if (value)
      this.data.damage.dice.add({
        value,
        labelComponents: [
          { key: `wv.rules.skills.names.${this.weapon.data.data.skill}` },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });
  }

  /** Check whether this attack matches the given list of tags. */
  matches(tags: string[] | undefined): boolean {
    if (tags === undefined) return true;

    return !tags.some((tag) => !this.data.tags.includes(tag));
  }

  protected applyRangeDamageDiceMod(range: ranges.RangeBracket): void {
    const value = this.getRangeDamageDiceMod(range);
    if (value)
      this.data.damage.dice.add({
        value,
        labelComponents: [
          { key: "wv.rules.range.singular" },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });
  }

  /**
   * Get the data external to the attack.
   * @throws If the potential Prompt is closed without submitting
   */
  protected async getExternalData(
    actor: WvActor,
    token: Token | null | undefined,
    target: Token | null | undefined
  ): Promise<ExternalData> {
    const i18n = getGame().i18n;

    return Prompt.get<PromptSpec>(
      {
        alias: {
          type: "text",
          label: i18n.localize("wv.system.misc.speakerAlias"),
          value: actor.name
        },
        modifier: {
          type: "number",
          label: i18n.localize("wv.system.misc.modifier"),
          value: 0,
          min: -100,
          max: 100
        },
        range: {
          type: "number",
          label: i18n.localize("wv.rules.range.distance.name"),
          value: interact.getRange(token, target) ?? 0,
          min: 0,
          max: 99999
        }
      },
      { title: `${this.weapon.data.name} - ${this.name}` }
    );
  }

  /** Get the hit roll target. */
  protected getHitRollTarget(
    skill: CompositeNumber,
    rangeModifier: number,
    promptHitModifier: number,
    criticalSuccess: number,
    criticalFailure: number
  ): CompositeNumber {
    const hitChance = skill.clone();

    if (rangeModifier)
      hitChance.add({
        value: rangeModifier,
        labelComponents: [{ key: "wv.rules.range.singular" }]
      });

    if (promptHitModifier)
      hitChance.add({
        value: promptHitModifier,
        labelComponents: [{ key: "wv.system.misc.modifier" }]
      });

    const total = hitChance.total;
    if (total < criticalSuccess) {
      hitChance.add({
        value: criticalSuccess - total,
        labelComponents: [{ key: "wv.rules.criticals.success" }]
      });
    }
    if (total > criticalFailure) {
      hitChance.add({
        value: total - criticalFailure,
        labelComponents: [{ key: "wv.rules.criticals.failure" }]
      });
    }

    return hitChance;
  }

  /** Get the Strength damage modifier dice for the given Strength value. */
  protected getStrengthDamageDiceMod(strength: number): number {
    if (!this.data.damage.diceRange) {
      return 0;
    }

    if (strength > 10) {
      return 3;
    } else if (strength >= 8) {
      return 2;
    } else if (strength >= 4) {
      return 1;
    }

    return 0;
  }

  /** Get the "skillful" skill-based damage dice modifier value. */
  protected getSkillfulDamageDiceMod(skill: number): number {
    return Math.floor(skill / 20);
  }

  /** Get the range damage modifier dice for the given range bracket. */
  protected getRangeDamageDiceMod(range: ranges.RangeBracket): number {
    if (this.data.damage.damageFallOff === "shotgun") {
      switch (range) {
        case ranges.RangeBracket.LONG:
          return -4;
        case ranges.RangeBracket.MEDIUM:
          return -2;
      }
    }

    return 0;
  }

  /** Create the default message data for weapon attack messages. */
  protected createDefaultMessageData(
    speaker: foundry.data.ChatMessageData["speaker"]["_source"],
    options?: RollOptions
  ): ChatMessageDataConstructorData {
    return {
      speaker,
      whisper: options?.whisperToGms
        ? ChatMessage.getWhisperRecipients("gm")
        : null
    };
  }

  /** Create a weapon attack message, signaling out of range. */
  protected createOutOfRangeMessage(
    commonData: ChatMessageDataConstructorData,
    commonFlags: deco.CommonWeaponAttackFlags
  ): void {
    const flags: deco.NotExecutedAttackFlags = {
      ...commonFlags,
      executed: false,
      reason: "outOfRange"
    };

    ChatMessage.create({
      ...commonData,
      flags: { [CONSTANTS.systemId]: flags }
    });
  }

  /** Create a weapon attack message, signaling insufficient AP. */
  protected createNotEnoughApMessage(
    commonData: ChatMessageDataConstructorData,
    commonFlags: deco.CommonWeaponAttackFlags
  ): void {
    const flags: deco.NotExecutedAttackFlags = {
      ...commonFlags,
      executed: false,
      reason: "insufficientAp"
    };

    ChatMessage.create({
      ...commonData,
      flags: { [CONSTANTS.systemId]: flags }
    });
  }

  /** Create a chat message for an executed attack. */
  protected async createAttackMessage(
    commonData: ChatMessageDataConstructorData,
    commonFlags: deco.CommonWeaponAttackFlags,
    hitRoll: Roll,
    damageRoll: Roll
  ): Promise<void> {
    const actorId =
      commonData.speaker?.actor instanceof WvActor
        ? commonData.speaker.actor.id
        : commonData.speaker?.actor;

    await Promise.all([
      diceSoNice(hitRoll, commonData.whisper ?? null, { actor: actorId }),
      diceSoNice(damageRoll, commonData.whisper ?? null, { actor: actorId })
    ]);

    const flags: deco.ExecutedAttackFlags = {
      ...commonFlags,
      executed: true,
      rolls: {
        damage: {
          formula: damageRoll.formula,
          results:
            damageRoll.dice[0]?.results.map((result) => result.result) ?? [],
          total: damageRoll.total ?? this.data.damage.base.total
        },
        hit: {
          critical: hitRoll.dice[0]?.results[0]?.critical,
          formula: hitRoll.formula,
          result: hitRoll.dice[0]?.results[0]?.result ?? 0,
          total: hitRoll.total ?? 0
        }
      }
    };

    ChatMessage.create({
      ...commonData,
      flags: { [CONSTANTS.systemId]: flags }
    });
  }
}

/** The drag data of a Weapon Attack */
export interface WeaponAttackDragData extends DragData {
  /** The ID of the Actor, owning the Weapon */
  actorId?: string | null | undefined;

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
    typeof data.attackName === "string" &&
    typeof data.weaponId === "string"
  );
}

/** The Prompt input spec for an attack prompt */
type PromptSpec = {
  alias: TextInputSpec;
  modifier: NumberInputSpec;
  range: NumberInputSpec;
};

/** Data external to the attack */
interface ExternalData {
  /** The chat message alias of the executing actor */
  alias: string;

  /** A possible modifier for the attack */
  modifier: number;

  /** The range to the target in meters */
  range: number;
}

/** Options for modifying Attack rolls. */
export interface RollOptions {
  /**
   * Whether to whisper the Attack to GMs.
   * @defaultValue `false`
   */
  whisperToGms?: boolean;
}

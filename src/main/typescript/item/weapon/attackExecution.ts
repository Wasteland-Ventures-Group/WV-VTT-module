import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import { CONSTANTS, RangeBracket } from "../../constants.js";
import {
  CompositeNumber,
  ExternalAttackData,
  promptRoll
} from "../../data/common.js";
import type { AttackProperties } from "../../data/item/weapon/attack/properties.js";
import Formulator from "../../formulator.js";
import type * as deco from "../../hooks/renderChatMessage/decorateSystemMessage/decorateWeaponAttack.js";
import diceSoNice from "../../integrations/diceSoNice/diceSoNice.js";
import * as interact from "../../interaction.js";
import { LOG } from "../../systemLogger.js";
import SystemRulesError from "../../systemRulesError.js";
import Weapon from "../weapon.js";

/** An execution flow of a weapon attack. */
export default class AttackExecution {
  /**
   * Create and execute an execution flow of an attack.
   * @param name - the identifier name of the attack
   * @param attackProperties - the attack properties
   * @param weapon - the Weapon the attack belongs to
   */
  static async execute(
    name: string,
    attackProperties: AttackProperties,
    weapon: Weapon
  ): Promise<void> {
    await (await AttackExecution.new(name, attackProperties, weapon)).execute();
  }

  static async new(
    name: string,
    attackProperties: AttackProperties,
    weapon: Weapon
  ): Promise<AttackExecution> {
    let token = interact.getFirstControlledToken();

    let executionAttackProperties = attackProperties;
    let executionWeapon = weapon;
    let executionActor = executionWeapon.actor ?? interact.getActor(token);
    if (!executionActor)
      throw new SystemRulesError(
        "Can not execute a weapon attack without an actor!"
      );

    if (!executionWeapon.actor) {
      LOG.debug(
        "Setting up a new ephemeral Weapon/Actor pair.",
        executionWeapon,
        executionActor
      );

      const clonedActor = await executionActor.clone();
      if (!clonedActor) {
        LOG.error("Could not clone the actor.", executionActor);
        throw new Error("Could not clone the actor.");
      }
      executionActor = clonedActor;

      const weaponId = executionActor.data.update({
        items: [executionWeapon.toObject()]
      }).items?.[0]?._id;
      if (!weaponId) throw new Error("Could not embed the weapon.");

      executionActor.prepareData();

      const embeddedWeapon = executionActor.items.get(weaponId);
      if (!(embeddedWeapon instanceof Weapon))
        throw new Error("Could not find the embedded weapon.");

      executionWeapon = embeddedWeapon;

      const ephAttackProps = executionWeapon.data.data.attacks.attacks[name];
      if (!ephAttackProps)
        throw new Error("Could not find the attack on the ephemeral weapon.");

      executionAttackProperties = ephAttackProps;
    }

    token ??= interact.getActorToken(executionActor);

    return new this(
      name,
      executionAttackProperties,
      executionWeapon,
      token,
      interact.getFirstTarget()
    );
  }

  /**
   * Create an execution flow of an attack.
   * @param name - the identifier name of the attack
   * @param attackProperties - the attack properties
   * @param weapon - the Weapon the attack belongs to (this and its actor should already be finalized)
   */
  constructor(
    public name: string,
    public attackProperties: AttackProperties,
    public weapon: Weapon,
    public token: Token | undefined,
    public target: Token | undefined
  ) {
    const actor = this.weapon.actor;
    if (!actor)
      throw new SystemRulesError(
        "Can not create an AttackExecution for a weapon without an actor!"
      );
    this.actor = actor;
  }

  actor: WvActor;

  /** Execute the attack */
  async execute(): Promise<void> {
    // Get needed external data ------------------------------------------------
    let externalData: ExternalAttackData;
    try {
      externalData = await this.getExternalData(
        this.actor,
        this.token,
        this.target
      );
    } catch (e) {
      if (e === "closed") return;
      else throw e;
    }
    const { alias, modifier, range, whisperToGms } = externalData;

    // Create common chat message data -----------------------------------------
    const commonData: ChatMessageDataConstructorData =
      this.createDefaultMessageData(
        {
          scene: null,
          actor: this.actor.id,
          token: this.token?.id ?? null,
          alias
        },
        whisperToGms
      );

    // Get range bracket -------------------------------------------------------
    const rangeBracket = this.weapon.data.data.ranges.getRangeBracket(
      range,
      this.attackProperties.rangePickingTags,
      this.actor.data.data.specials
    );
    const isOutOfRange = RangeBracket.OUT_OF_RANGE === rangeBracket;
    const damageDice =
      this.attackProperties.damage.getRangeModifiedDamageDice(range);

    // Calculate hit roll target -----------------------------------------------
    const rangeModifier =
      this.weapon.data.data.ranges.getRangeModifier(rangeBracket);

    const critSuccess = this.actor.data.data.secondary.criticals.success;
    const critFailure = this.actor.data.data.secondary.criticals.failure;
    const hitChance = this.getHitRollTarget(
      this.actor.data.data.skills[this.weapon.data.data.skill],
      rangeModifier,
      modifier,
      critSuccess.total,
      critFailure.total
    );

    // Calculate AP ------------------------------------------------------------
    const previousAp = this.actor.data.data.vitals.actionPoints.value;
    const apCost = this.attackProperties.ap.total;
    const remainingAp = isOutOfRange
      ? previousAp
      : this.token?.inCombat
      ? previousAp - apCost
      : previousAp;
    const notEnoughAp = remainingAp < 0;

    // Create common attack flags ----------------------------------------------
    const commonFlags: Required<deco.CommonWeaponAttackFlags> = {
      type: "weaponAttack",
      details: {
        ap: {
          cost: apCost,
          previous: previousAp,
          remaining: remainingAp
        },
        criticals: {
          failure: critFailure.toObject(false),
          success: critSuccess.toObject(false)
        },
        damage: {
          base: this.attackProperties.damage.base.toObject(false),
          dice: damageDice.toObject(false)
        },
        hit: hitChance.toObject(false),
        range: {
          bracket: rangeBracket,
          distance: range
        }
      },
      weapon: {
        display: {
          ranges: this.weapon.data.data.ranges.getDisplayRanges(
            this.attackProperties.rangePickingTags,
            this.actor.data.data.specials
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
    if (this.token?.inCombat) {
      if (notEnoughAp) {
        this.createNotEnoughApMessage(commonData, commonFlags);
        return;
      }
      this.actor.updateActionPoints(remainingAp);
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
        this.attackProperties.damage.base.total,
        damageDice.total
      ).toString()
    ).evaluate({ async: false });

    // Create attack message ---------------------------------------------------
    this.createAttackMessage(commonData, commonFlags, hitRoll, damageRoll);
  }

  /**
   * Get the data external to the attack.
   * @throws If the potential Prompt is closed without submitting
   */
  private async getExternalData(
    actor: WvActor,
    token: Token | undefined,
    target: Token | undefined
  ): Promise<ExternalAttackData> {
    return promptRoll(
      `${this.weapon.data.name} - ${this.name}`,
      actor.name,
      null,
      interact.getDistance(token, target) ?? 0
    );
  }

  /** Get the hit roll target. */
  private getHitRollTarget(
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

  /** Create the default message data for weapon attack messages. */
  private createDefaultMessageData(
    speaker: foundry.data.ChatMessageData["speaker"]["_source"],
    whisperToGms: boolean
  ): ChatMessageDataConstructorData {
    return {
      speaker,
      whisper: whisperToGms ? ChatMessage.getWhisperRecipients("gm") : null
    };
  }

  /** Create a weapon attack message, signaling out of range. */
  private createOutOfRangeMessage(
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
  private createNotEnoughApMessage(
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
  private async createAttackMessage(
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
          total: damageRoll.total ?? this.attackProperties.damage.base.total
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

import WvActor from "../../actor/wvActor.js";
import { AttackPrompt, type AttackPromptData } from "../../applications/prompt.js";
import { CONSTANTS, RangeBracket } from "../../constants.js";
import { CompositeNumber } from "../../data/common.js";
import { AttackProperties, AttacksProperties } from "../../data/item/weapon/attack/properties.js";
import Formulator from "../../formulator.js";
import {
  createDefaultMessageData,
  isRollBlindedForCurrUser
} from "../../foundryHelpers.js";
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
    attackProperties: AttackProperties,
    weapon: Weapon
  ): Promise<void> {
    await (await AttackExecution.new(attackProperties, weapon)).execute();
  }

  static async new(
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

      const clonedActor = executionActor.clone();
      if (!clonedActor) {
        LOG.error("Could not clone the actor.", executionActor);
        throw new Error("Could not clone the actor.");
      }
      executionActor = clonedActor;

      const weaponId = (await executionActor.update({
        items: [executionWeapon.toObject()]
      }))?.items?.find((_) => true)?._id;
      if (!weaponId) throw new Error("Could not embed the weapon.");

      executionActor.prepareData();

      const embeddedWeapon = executionActor.items.get(weaponId);
      if (!(embeddedWeapon instanceof Weapon))
        throw new Error("Could not find the embedded weapon.");

      executionWeapon = embeddedWeapon;

      const ephAttackProps = AttacksProperties.find(executionWeapon.system.attacks, attackProperties.name);
      if (!ephAttackProps)
        throw new Error("Could not find the attack on the ephemeral weapon.");

      executionAttackProperties = ephAttackProps;
    }

    token ??= interact.getActorToken(executionActor);

    return new this(
      attackProperties.name,
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
    const secondary = this.actor.system.secondary;

    // Get needed external data ------------------------------------------------
    let externalData: AttackPromptData;
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
    const { alias, modifier, range, rollMode, aim, sneakAttack, calledShot } =
      externalData;

    // Create common chat message data -----------------------------------------
    const commonData = createDefaultMessageData(
      {
        scene: null,
        actor: this.actor.id,
        token: this.token?.id ?? null,
        alias
      },
      rollMode
    );

    // Get range bracket -------------------------------------------------------
    const rangeBracket = this.weapon.system.ranges.getRangeBracket(
      range,
      this.attackProperties.rangePickingTags,
      this.actor.system.specials
    );
    const isOutOfRange = RangeBracket.OUT_OF_RANGE === rangeBracket;
    const damageDice =
      this.attackProperties.damage.getRangeModifiedDamageDice(range);

    // Calculate hit roll target -----------------------------------------------
    const rangeModifier =
      this.weapon.system.ranges.getRangeModifier(rangeBracket);

    const critSuccess = secondary.criticals.success.clone();
    if (sneakAttack)
      critSuccess.add({
        value: secondary.sneakAttackMod.rollMod.total,
        labelComponents: [{ key: "wv.rules.actions.attack.sneakAttack" }]
      });

    const critFailure = secondary.criticals.failure;

    const hitChance = this.getHitRollTarget(
      this.actor.system.skills[this.weapon.system.skill],
      rangeModifier,
      modifier,
      critSuccess.total,
      critFailure.total,
      aim,
      secondary.aimMod.rollMod.total
    );

    // Calculate AP ------------------------------------------------------------
    const previousAp = this.actor.system.vitals.actionPoints.value;
    const apCost = new CompositeNumber(this.attackProperties.ap.total, {
      min: 0
    });
    if (aim)
      apCost.add({
        labelComponents: [{ key: "wv.rules.actions.attack.aim" }],
        value: secondary.aimMod.apCost.total
      });
    if (sneakAttack)
      apCost.add({
        labelComponents: [{ key: "wv.rules.actions.attack.sneakAttack" }],
        value: secondary.sneakAttackMod.apCost.total
      });
    if (calledShot)
      apCost.add({
        labelComponents: [{ key: "wv.rules.actions.attack.calledShot" }],
        value: secondary.calledShotMod.total
      });

    const remainingAp =
      isOutOfRange || !this.token?.inCombat
        ? previousAp
        : previousAp - apCost.total;
    const notEnoughAp = remainingAp < 0;

    // Create common attack flags ----------------------------------------------
    const commonFlags: Required<deco.CommonWeaponAttackFlags> = {
      type: "weaponAttack",
      details: {
        ap: {
          cost: apCost.toObject(false),
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
        successChance: hitChance.toObject(false),
        range: {
          bracket: rangeBracket,
          distance: range
        }
      },
      blind: commonData.blind ?? false,
      weapon: {
        display: {
          ranges: this.weapon.system.ranges.getDisplayRanges(
            this.attackProperties.rangePickingTags,
            this.actor.system.specials
          )
        },
        image: this.weapon.img,
        name: this.weapon.name,
        system: {
          attack: {
            name: this.name
          },
          name: this.weapon.name
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
    const hitRoll = await new Roll(
      Formulator.skill(hitChance.total)
        .toString()
    ).evaluate();

    // Damage roll -------------------------------------------------------------
    const damageRoll = await new Roll(
      Formulator.damage(
        this.attackProperties.damage.base.total,
        damageDice.total
      ).toString()
    ).evaluate();

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
  ): Promise<AttackPromptData> {
    const ownerName = token?.name ?? actor.name;
    return AttackPrompt.get(
      {
        alias: ownerName,
        range: interact.getDistance(token, target) ?? 0
      },
      {
        title: `${ownerName} — ${this.name}`
      }
    );
  }

  /** Get the hit roll target. */
  private getHitRollTarget(
    skill: CompositeNumber,
    rangeModifier: number,
    promptHitModifier: number,
    criticalSuccess: number,
    criticalFailure: number,
    aimed: boolean,
    aimedMod: number
  ): CompositeNumber {
    const hitChance = skill.clone();

    if (aimed)
      hitChance.add({
        value: aimedMod,
        labelComponents: [{ key: "wv.rules.actions.attack.aim" }]
      });

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

  /** Create a weapon attack message, signaling out of range. */
  private createOutOfRangeMessage(
    commonData: ChatMessage.CreateData,
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
    commonData: ChatMessage.CreateData,
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
    commonData: ChatMessage.CreateData,
    commonFlags: deco.CommonWeaponAttackFlags,
    hitRoll: Roll,
    damageRoll: Roll
  ): Promise<void> {
    const actorId =
      commonData.speaker?.actor instanceof WvActor
        ? commonData.speaker.actor.id
        : commonData.speaker?.actor;

    const blinded = isRollBlindedForCurrUser(commonFlags.blind);
    await Promise.all([
      diceSoNice(hitRoll, commonData.whisper ?? null, blinded, {
        actor: actorId
      }),
      diceSoNice(damageRoll, commonData.whisper ?? null, blinded, {
        actor: actorId
      })
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

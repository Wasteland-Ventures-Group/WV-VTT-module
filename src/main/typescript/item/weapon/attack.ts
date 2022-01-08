import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import Prompt, {
  NumberInputSpec,
  TextInputSpec
} from "../../applications/prompt.js";
import { CONSTANTS, SpecialName } from "../../constants.js";
import type { AttackSource } from "../../data/item/weapon/attack/source.js";
import type DragData from "../../dragData.js";
import Formulator from "../../formulator.js";
import { getGame } from "../../foundryHelpers.js";
import * as helpers from "../../helpers.js";
import type * as deco from "../../hooks/renderChatMessage/decorateSystemMessage/decorateWeaponAttack.js";
import diceSoNice from "../../integrations/diceSoNice/diceSoNice.js";
import * as interact from "../../interaction.js";
import type Weapon from "../weapon.js";
import * as ranges from "./ranges.js";

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
    // Get owners and data -----------------------------------------------------
    let token = interact.getFirstControlledToken();
    const actor = this.weapon.actor ?? interact.getActor(token);
    token ??= interact.getActorToken(actor);
    const target = interact.getFirstTarget();

    // Get needed external data ------------------------------------------------
    let externalData: ExternalData;
    try {
      externalData = await this.getExternalData(actor, token, target);
    } catch (e) {
      if (e === "closed") return;
      else throw e;
    }
    const {
      alias,
      ap: previousAp,
      modifier: promptHitModifier,
      range,
      skillTotal,
      critSuccess,
      critFailure,
      ...specials
    } = externalData;

    // Get speaker -------------------------------------------------------------
    const speaker = {
      scene: null,
      actor: actor?.id ?? null,
      token: null,
      alias
    };

    // Create common chat message data -----------------------------------------
    const commonData: ChatMessageDataConstructorData =
      this.createDefaultMessageData(speaker, options);

    // Get range bracket -------------------------------------------------------
    const rangeBracket = ranges.getRangeBracket(
      this.weapon.systemData.ranges,
      range,
      specials
    );
    const outOfRange = ranges.RangeBracket.OUT_OF_RANGE === rangeBracket;

    // Calculate damage dice ---------------------------------------------------
    const strengthDamageDiceMod = this.getStrengthDamageDiceMod(
      specials.strength
    );
    const rangeDamageDiceMod = this.getRangeDamageDiceMod(rangeBracket);
    const damageDice = this.getDamageDice(
      strengthDamageDiceMod,
      rangeDamageDiceMod
    );

    // Calculate hit roll target -----------------------------------------------
    const rangeModifier = ranges.getRangeModifier(
      this.weapon.systemData.ranges,
      rangeBracket
    );
    const hitTotal = this.getHitRollTarget(
      skillTotal,
      rangeModifier,
      promptHitModifier,
      critSuccess,
      critFailure
    );

    // Calculate AP ------------------------------------------------------------
    const remainingAp = outOfRange
      ? previousAp
      : token?.inCombat
      ? previousAp - this.data.ap
      : previousAp;
    const notEnoughAp = 0 > remainingAp;

    // Create common attack flags ----------------------------------------------
    const commonFlags: Required<deco.CommonWeaponAttackFlags> = {
      type: "weaponAttack",
      attackName: this.name,
      details: {
        ap: {
          cost: this.data.ap,
          previous: previousAp,
          remaining: remainingAp
        },
        criticals: {
          failure: critFailure,
          success: critSuccess
        },
        damage: {
          base: {
            base: this.data.damage.base,
            modifiers: this.getDamageBaseModifierFlags(),
            total: this.data.damage.base
          },
          dice: {
            base: this.data.damage.dice,
            modifiers: this.getDamageDiceModifierFlags(
              strengthDamageDiceMod,
              rangeDamageDiceMod
            ),
            total: damageDice
          }
        },
        hit: {
          base: skillTotal,
          modifiers: this.getHitModifierFlags(rangeModifier, promptHitModifier),
          total: hitTotal
        },
        range: {
          bracket: rangeBracket,
          distance: range
        }
      },
      ownerSpecials: specials,
      weaponImage: this.weapon.img,
      weaponName: this.weapon.data.name,
      weaponSystemData: this.weapon.systemData
    };

    // Check range -------------------------------------------------------------
    if (outOfRange) {
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
      Formulator.skill(hitTotal)
        .criticals({ success: critSuccess, failure: critFailure })
        .toString()
    ).evaluate({ async: false });

    // Damage roll -------------------------------------------------------------
    const damageRoll = new Roll(
      Formulator.damage(this.data.damage.base, damageDice).toString()
    ).evaluate({ async: false });

    // Create attack message ---------------------------------------------------
    this.createAttackMessage(commonData, commonFlags, hitRoll, damageRoll);
  }

  /** Get the system formula representation of the damage of this attack. */
  get damageFormula(): string {
    if (!this.data.damage.diceRange)
      return `${this.data.damage.base}+(${this.data.damage.dice})`;

    if (this.weapon.actor) {
      const dice =
        this.data.damage.dice +
        this.getStrengthDamageDiceMod(
          this.weapon.actor.data.data.specials.strength
        );
      return `${this.data.damage.base}+(${dice})`;
    }

    const low =
      this.data.damage.dice +
      this.getStrengthDamageDiceMod(helpers.getSpecialMinPoints());
    const high =
      this.data.damage.dice +
      this.getStrengthDamageDiceMod(helpers.getSpecialMaxPoints());
    return `${this.data.damage.base}+(${low}-${high})`;
  }

  /**
   * Get the data external to the attack.
   * @throws If the potential Prompt is closed without submitting
   */
  protected async getExternalData(
    actor: WvActor | null | undefined,
    token: Token | null | undefined,
    target: Token | null | undefined
  ): Promise<ExternalData> {
    const i18n = getGame().i18n;
    const specialNames = ranges.getRangesSpecials(
      this.weapon.systemData.ranges
    );
    if (this.data.damage.diceRange) specialNames.add("strength");
    const specialSpecs = [...specialNames].reduce((specs, specialName) => {
      specs[specialName] = {
        type: "number",
        label: i18n.format("wv.prompt.labels.special", {
          special: i18n.localize(`wv.specials.names.${specialName}.long`)
        }),
        value: actor?.data.data.specials[specialName] ?? 0,
        min: 0,
        max: 15
      };
      return specs;
    }, {} as Record<SpecialName, NumberInputSpec>);

    return Prompt.get<PromptSpec>(
      {
        alias: {
          type: "text",
          label: i18n.localize("wv.prompt.labels.alias"),
          value: actor?.name
        },
        ap: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.actionPoints"),
          value: actor?.actionPoints.value,
          min: 0,
          max: actor?.actionPoints.max ?? 99
        },
        modifier: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.genericModifier"),
          value: 0,
          min: -100,
          max: 100
        },
        range: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.range"),
          value: interact.getRange(token, target) ?? 0,
          min: 0,
          max: 99999
        },
        ...specialSpecs,
        skillTotal: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.skillTotal"),
          value:
            actor?.data.data.skills[this.weapon.systemData.skill]?.total ?? 0,
          min: 0,
          max: 100
        },
        critSuccess: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.criticalSuccess"),
          value: actor?.data.data.secondary.criticals.success ?? 5,
          min: 0,
          max: 100
        },
        critFailure: {
          type: "number",
          label: i18n.localize("wv.prompt.labels.criticalFailure"),
          value: actor?.data.data.secondary.criticals.failure ?? 96,
          min: 0,
          max: 100
        }
      },
      { title: `${this.weapon.data.name} - ${this.name}` }
    );
  }

  /** Get the hit roll target. */
  protected getHitRollTarget(
    skillTotal: number,
    rangeModifier: number,
    promptHitModifier: number,
    criticalSuccess: number,
    criticalFailure: number
  ) {
    const hitTotal = skillTotal + rangeModifier + promptHitModifier;
    return Math.clamped(hitTotal, criticalSuccess, criticalFailure);
  }

  /** Get the amount of damage d6 of this attack. */
  protected getDamageDice(strengthMod: number, rangeMod: number): number {
    const dice = this.data.damage.dice + strengthMod + rangeMod;
    return dice > 0 ? dice : 0;
  }

  /** Get the Strength damage modifier dice for the given Strength value. */
  protected getStrengthDamageDiceMod(strength: number | undefined): number {
    if (!this.data.damage.diceRange || typeof strength !== "number") {
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

  /** Get the hit modifier flags. */
  protected getHitModifierFlags(
    rangeHitModifier: number,
    promptHitModifier: number
  ): deco.ModifierFlags[] {
    const modifiers: deco.ModifierFlags[] = [];

    if (rangeHitModifier) {
      modifiers.push({
        amount: rangeHitModifier,
        key: "wv.weapons.modifiers.damage.dice.range"
      });
    }

    if (promptHitModifier) {
      modifiers.push({
        amount: promptHitModifier,
        key: "wv.weapons.modifiers.hit.interactive"
      });
    }

    return modifiers;
  }

  /** Get the damage base value modifier flags. */
  protected getDamageBaseModifierFlags(): deco.ModifierFlags[] {
    return [];
  }

  /** Get the damage dice modifier flags. */
  protected getDamageDiceModifierFlags(
    strengthMod: number,
    rangeMod: number
  ): deco.ModifierFlags[] {
    const modifiers: deco.ModifierFlags[] = [];

    if (strengthMod) {
      modifiers.push({
        amount: strengthMod,
        key: "wv.weapons.modifiers.damage.dice.strength"
      });
    }

    if (rangeMod) {
      modifiers.push({
        amount: rangeMod,
        key: "wv.weapons.modifiers.damage.dice.range"
      });
    }

    return modifiers;
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
          total: damageRoll.total ?? this.data.damage.base
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

/**
 * The Prompt input spec for an attack prompt, can have optional SPECIAL specs
 */
type PromptSpec = {
  alias: TextInputSpec;
  ap: NumberInputSpec;
  modifier: NumberInputSpec;
  range: NumberInputSpec;
  skillTotal: NumberInputSpec;
  critSuccess: NumberInputSpec;
  critFailure: NumberInputSpec;
} & Record<SpecialName, NumberInputSpec>;

/** Data external to the attack, can have optional SPECIAL data */
type ExternalData = {
  /** The chat message alias of the executing actor */
  alias: string;

  /** The current action points of the actor */
  ap: number;

  /** A possible modifier for the attack */
  modifier: number;

  /** The range to the target in meters */
  range: number;

  /** The skill total of the executing actor */
  skillTotal: number;

  /** The critical success rate of the actor */
  critSuccess: number;

  /** The critical failure rate of the actor */
  critFailure: number;
} & Record<SpecialName, number>;

/**
 * Options for modifying Attack rolls.
 */
export interface RollOptions {
  /**
   * Whether to whisper the Attack to GMs.
   * @defaultValue `false`
   */
  whisperToGms?: boolean;
}

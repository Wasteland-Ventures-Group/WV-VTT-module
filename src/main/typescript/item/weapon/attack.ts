import Prompt, {
  NumberInputSpec,
  TextInputSpec
} from "../../applications/prompt.js";
import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import WvActor from "../../actor/wvActor.js";
import { getGame } from "../../foundryHelpers.js";
import type Weapon from "../weapon.js";
import Formulator from "../../formulator.js";
import type { Specials } from "../../data/actor/properties.js";
import type DragData from "../../dragData.js";
import { CONSTANTS, SpecialName } from "../../constants.js";
import type * as deco from "../../hooks/renderChatMessage/decorateSystemMessage/decorateWeaponAttack.js";
import * as ranges from "../../data/item/weapon/ranges.js";
import * as interact from "../../interaction.js";
import * as helpers from "../../helpers.js";
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

    // Get range bracket and check bracket -------------------------------------
    const rangeBracket = ranges.getRangeBracket(
      this.weapon.systemData.ranges,
      range,
      specials
    );
    if (rangeBracket === ranges.RangeBracket.OUT_OF_RANGE) {
      this.createOutOfRangeMessage(speaker, options);
      return;
    }

    // Check AP and subtract in combat -----------------------------------------
    if (actor?.getActiveTokens(true).some((token) => token.inCombat)) {
      const currentAp = actor.data.data.vitals.actionPoints.value;
      const apUse = this.data.ap;
      if (currentAp < apUse) {
        this.createNotEnoughApMessage(speaker, options);
        return;
      }
      actor.updateActionPoints(currentAp - apUse);
    }

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

    // Hit roll ----------------------------------------------------------------
    const hitRoll = new Roll(
      Formulator.skill(hitTotal)
        .criticals({ success: critSuccess, failure: critFailure })
        .toString()
    ).evaluate({ async: false });

    // Calculate damage dice ---------------------------------------------------
    const strengthDamageDiceMod = this.getStrengthDamageDiceMod(
      specials.strength
    );
    const rangeDamageDiceMod = this.getRangeDamageDiceMod(rangeBracket);
    const damageDice = this.getDamageDice(
      strengthDamageDiceMod,
      rangeDamageDiceMod
    );

    // Damage roll -------------------------------------------------------------
    const damageRoll = new Roll(
      Formulator.damage(this.data.damage.base, damageDice).toString()
    ).evaluate({ async: false });

    // Compose details ---------------------------------------------------------
    const details: NonNullable<deco.ExecutedAttackFlags["details"]> = {
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
    };

    // Create attack message ---------------------------------------------------
    this.createAttackMessage(
      speaker,
      specials,
      details,
      hitRoll,
      damageRoll,
      options
    );
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

  /** Get the default ChatMessage flags for this Weapon Attack. */
  protected get defaultChatMessageFlags(): deco.WeaponAttackFlags {
    return {
      type: "weaponAttack",
      weaponName: this.weapon.data.name,
      weaponImage: this.weapon.img,
      weaponSystemData: this.weapon.systemData,
      attackName: this.name,
      executed: false
    };
  }

  /** Create a weapon attack message, signaling out of range. */
  protected createOutOfRangeMessage(
    speaker: foundry.data.ChatMessageData["speaker"]["_source"],
    options?: RollOptions
  ): void {
    ChatMessage.create({
      ...this.createDefaultMessageData(speaker, options),
      flags: {
        [CONSTANTS.systemId]: {
          ...this.defaultChatMessageFlags,
          executed: false,
          reason: "outOfRange"
        }
      }
    });
  }

  /** Create a weapon attack message, signaling insufficient AP. */
  protected createNotEnoughApMessage(
    speaker: foundry.data.ChatMessageData["speaker"]["_source"],
    options?: RollOptions
  ): void {
    ChatMessage.create({
      ...this.createDefaultMessageData(speaker, options),
      flags: {
        [CONSTANTS.systemId]: {
          ...this.defaultChatMessageFlags,
          executed: false,
          reason: "insufficientAp"
        }
      }
    });
  }

  /** Create a chat message for an executed attack. */
  protected async createAttackMessage(
    speaker: foundry.data.ChatMessageData["speaker"]["_source"],
    specials: Partial<Specials>,
    details: NonNullable<deco.ExecutedAttackFlags["details"]>,
    hitRoll: Roll,
    damageRoll: Roll,
    options?: RollOptions
  ): Promise<void> {
    const defaultData = this.createDefaultMessageData(speaker, options);
    const actorId =
      defaultData.speaker?.actor instanceof WvActor
        ? defaultData.speaker.actor.id
        : defaultData.speaker?.actor;

    await Promise.all([
      diceSoNice(hitRoll, defaultData.whisper ?? null, { actor: actorId }),
      diceSoNice(damageRoll, defaultData.whisper ?? null, { actor: actorId })
    ]);

    const data: ChatMessageDataConstructorData = {
      ...defaultData,
      flags: {
        [CONSTANTS.systemId]: {
          ...this.defaultChatMessageFlags,
          executed: true,
          ownerSpecials: specials,
          details: details,
          rolls: {
            damage: {
              formula: damageRoll.formula,
              results:
                damageRoll.dice[0]?.results.map((result) => result.result) ??
                [],
              total: damageRoll.total ?? this.data.damage.base
            },
            hit: {
              critical: hitRoll.dice[0]?.results[0]?.critical,
              formula: hitRoll.formula,
              result: hitRoll.dice[0]?.results[0]?.result ?? 0,
              total: hitRoll.total ?? 0
            }
          }
        }
      }
    };

    ChatMessage.create(data);
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
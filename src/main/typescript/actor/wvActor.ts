import type { DocumentModificationOptions } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs";
import type { ActorDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import type { BaseUser } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs";
import type { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import {
  CONSTANTS,
  isSkillName,
  isSpecialName,
  SkillName,
  SpecialName,
  SpecialNames
} from "../constants.js";
import {
  Criticals,
  SecondaryStatistics
} from "../data/actor/character/properties.js";
import Skills, { Skill } from "../data/actor/character/skills/properties.js";
import type CharacterDataSource from "../data/actor/character/source.js";
import Specials, {
  Special
} from "../data/actor/character/specials/properties.js";
import type { Resource } from "../data/foundryCommon.js";
import type DragData from "../dragData.js";
import Formulator from "../formulator.js";
import { getGame } from "../foundryHelpers.js";
import { getGroundMoveRange, getGroundSprintMoveRange } from "../movement.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import SystemDataSchemaError from "../systemDataSchemaError.js";
import { LOG } from "../systemLogger.js";
import WvI18n from "../wvI18n.js";

/** The basic Wasteland Ventures Actor. */
export default class WvActor extends Actor {
  /** A convenience getter for the Actor's hit points. */
  get hitPoints(): Resource {
    return this.data.data.vitals.hitPoints;
  }

  /** A convenience getter for the Actor's action points. */
  get actionPoints(): Resource {
    return this.data.data.vitals.actionPoints;
  }

  /** A convenience getter for the Actor's strain. */
  get strain(): Resource {
    return this.data.data.vitals.strain;
  }

  /** Get the ground movement range of the actor. */
  get groundMoveRange(): number {
    return getGroundMoveRange(this);
  }

  /** Get the ground sprint movement range of the actor. */
  get groundSprintMoveRange(): number {
    return getGroundSprintMoveRange(this);
  }

  /**
   * Get a SPECIAL from this actor.
   * @throws If the SPECIALS have not been calculated yet.
   */
  getSpecial(name: SpecialName): Special {
    const special = this.data.data.specials[name];
    if (special === undefined)
      throw new Error("The SPECIALs have not been calculated yet!");

    return special;
  }

  /**
   * Get a Skill from this actor.
   * @throws If the Skills have not been calculated yet.
   */
  getSkill(name: SkillName): Skill {
    const skill = this.data.data.skills[name];
    if (skill === undefined)
      throw new Error("The Skills have not been calculated yet!");

    return skill;
  }

  /**
   * Create update data for updating the hit points and optionally update the
   * Actor.
   * @param hitPoints - the new hit points value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateHitPoints(hitPoints: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { hitPoints: { value: hitPoints } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Create update data for updating the action points and optionally update the
   * Actor.
   * @param actionPoints - the new action points value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateActionPoints(actionPoints: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { actionPoints: { value: actionPoints } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Create update data for updating the strain and optionally update the Actor.
   * @param strain - the new strain value
   * @param update - whether to directly update or only return the update data
   * @returns the update data
   */
  updateStrain(strain: number, update = true): UpdateData {
    const updateData: UpdateData = {
      _id: this.id,
      data: { vitals: { strain: { value: strain } } }
    };
    if (update) this.update(updateData);
    return updateData;
  }

  /**
   * Roll a SPECIAL for this Actor.
   * @param name - the name of the SPECIAL to roll
   */
  rollSpecial(name: SpecialName, options?: RollOptions): void {
    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSpecialRollFlavor(name),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };
    if (options?.whisperToGms) {
      msgOptions["whisper"] = ChatMessage.getWhisperRecipients("gm");
    }

    new Roll(
      Formulator.special(this.getSpecial(name).tempTotal)
        .modify(options?.modifier)
        .criticals(this.data.data.secondary.criticals)
        .toString()
    )
      .roll({ async: true })
      .then((r) => r.toMessage(msgOptions));
  }

  /**
   * Roll a Skill for this Actor.
   * @param name - the name of the Skill to roll
   */
  rollSkill(name: SkillName, options?: RollOptions): void {
    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSkillRollFlavor(name),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };
    if (options?.whisperToGms) {
      msgOptions["whisper"] = ChatMessage.getWhisperRecipients("gm");
    }

    new Roll(
      Formulator.skill(this.getSkill(name).total)
        .modify(options?.modifier)
        .criticals(this.data.data.secondary.criticals)
        .toString()
    )
      .roll({ async: true })
      .then((r) => r.toMessage(msgOptions));
  }

  override prepareBaseData(): void {
    const data = this.data.data;

    // Compute the level -------------------------------------------------------
    data.leveling.level = Math.floor(
      (1 + Math.sqrt(data.leveling.experience / 12.5 + 1)) / 2
    );

    // Compute the maximum skill points to spend -------------------------------
    data.leveling.maxSkillPoints = data.leveling.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );

    // Compute the SPECIALs ----------------------------------------------------
    data.specials = new Specials();
    for (const special of SpecialNames) {
      const points = data.leveling.specialPoints[special];
      data.specials[special] = new Special(points, points, points);
    }
  }

  override prepareEmbeddedDocuments(): void {
    super.prepareEmbeddedDocuments();
    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onPrepareEmbeddedDocuments());
  }

  override prepareDerivedData(): void {
    const data = this.data.data;

    // Compute the maximum hit points ------------------------------------------
    data.vitals.hitPoints.max = this.getSpecial("endurance").permTotal + 10;

    // Compute the maximum healing rate ----------------------------------------
    const endurance = this.getSpecial("endurance");
    if (endurance.tempTotal >= 8) {
      data.vitals.healingRate = 3;
    } else if (endurance.tempTotal >= 4) {
      data.vitals.healingRate = 2;
    } else {
      data.vitals.healingRate = 1;
    }

    // Compute the maximum action points ---------------------------------------
    data.vitals.actionPoints.max =
      Math.floor(this.getSpecial("agility").tempTotal / 2) + 10;

    // Compute the maximum strain ----------------------------------------------
    const level = data.leveling.level;
    if (level === undefined)
      throw new Error("The level should be computed before computing strain.");
    data.vitals.strain.max = 20 + Math.floor(level / 5) * 5;

    // Compute the maximum insanity --------------------------------------------
    data.vitals.insanity.max =
      Math.floor(this.getSpecial("intelligence").tempTotal / 2) + 5;

    // Init the secondary statistics -------------------------------------------
    data.secondary = new SecondaryStatistics();

    // Compute the critical values ---------------------------------------------
    const luck = this.getSpecial("luck").tempTotal;
    data.secondary.criticals = new Criticals(
      Math.max(1, luck),
      Math.min(100, 90 + luck)
    );

    // Compute the maximum carry weight ----------------------------------------
    data.secondary.maxCarryWeight =
      this.getSpecial("strength").tempTotal * 5 + 10;

    // Compute the skills ------------------------------------------------------
    data.skills = new Skills();
    let skill: SkillName;
    for (skill in CONSTANTS.skillSpecials) {
      data.skills[skill] = this.computeBaseSkill(skill);
    }
    data.skills["thaumaturgy"] = this.computeBaseSkill("thaumaturgy");

    // Modify values based on the size -----------------------------------------
    // TODO: hit chance, reach, combat trick mods
    switch (data.background.size) {
      case 4:
        data.vitals.hitPoints.max += 4;
        data.secondary.maxCarryWeight += 60;
        break;
      case 3:
        data.vitals.hitPoints.max += 2;
        data.secondary.maxCarryWeight += 40;
        break;
      case 2:
        data.vitals.hitPoints.max += 1;
        data.secondary.maxCarryWeight += 10;
        break;
      case 1:
        data.secondary.maxCarryWeight += 5;
        break;
      case -1:
        data.secondary.maxCarryWeight -= 5;
        break;
      case -2:
        data.vitals.hitPoints.max -= 1;
        data.secondary.maxCarryWeight -= 10;
        break;
      case -3:
        data.vitals.hitPoints.max -= 2;
        data.secondary.maxCarryWeight -= 40;
        break;
      case -4:
        data.vitals.hitPoints.max -= 4;
        data.secondary.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }
  }

  protected override async _preCreate(
    data: ActorDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preCreate(data, options, user);
    this.validateSystemData(this.data._source.data);
  }

  protected override async _preUpdate(
    changed: DeepPartial<ActorDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void> {
    super._preUpdate(changed, options, user);
    this.validateSystemData(
      foundry.utils.mergeObject(this.data._source.data, changed.data ?? {}, {
        recursive: options.recursive,
        inplace: false
      })
    );
  }

  /** Get RuleElements that apply to this Actor. */
  protected get applicableRuleElements(): RuleElement[] {
    const rules: RuleElement[] = [];

    this.data.items.forEach((item) => {
      item.data.data.rules.elements.forEach((rule) => {
        if (rule.target === "actor") rules.push(rule);
      });
    });

    return rules;
  }

  /**
   * Compute the initial Skill for the given skill name. This includes the
   * SPECIAL derived starting value and the final value only increased by skill
   * point ranks.
   * @param skill - the name of the skill
   */
  protected computeBaseSkill(skill: SkillName): Skill {
    const baseSkill =
      this.getSpecial(
        skill === "thaumaturgy"
          ? this.data.data.magic.thaumSpecial
          : CONSTANTS.skillSpecials[skill]
      ).permTotal *
        2 +
      Math.floor(this.getSpecial("luck").permTotal / 2);
    return new Skill(
      baseSkill,
      baseSkill + this.data.data.leveling.skillRanks[skill]
    );
  }

  /** Validate passed source system data. */
  protected validateSystemData(data: unknown): void {
    const validator = getGame().wv.validators.actor["character"];
    if (validator(data)) {
      if (
        this.hitPoints.max &&
        data.vitals.hitPoints.value > this.hitPoints.max
      )
        throw new Error("The hit points value exceeds the maximum.");

      if (
        this.actionPoints.max &&
        data.vitals.actionPoints.value > this.actionPoints.max
      )
        throw new Error("The action points value exceeds the maximum.");

      if (this.strain.max && data.vitals.strain.value > this.strain.max)
        throw new Error("The strain value exceeds the maximum.");

      return;
    }

    for (const error of validator.errors ?? []) {
      LOG.error(error);
    }

    throw new SystemDataSchemaError(validator.errors ?? []);
  }
}

/** The drag data of an Actor SPECIAL */
export interface SpecialDragData extends DragData {
  /** The ID of the Actor, the SPECIAL belongs to */
  actorId: string;

  /** The name of the SPECIAL on the Actor */
  specialName: SpecialName;

  type: "special";
}

/**
 * A custom typeguard, to check whether an unknown object is a SpecialDragData.
 * @param data - the unknown object
 * @returns whether it is a SpecialDragData
 */
export function isSpecialDragData(
  data: Record<string, unknown>
): data is SpecialDragData {
  return (
    data.type === "special" &&
    typeof data.actorId === "string" &&
    typeof data.specialName === "string" &&
    isSpecialName(data.specialName)
  );
}

/** The drag data of an Actor Skill */
export interface SkillDragData extends DragData {
  /** The ID of the Actor, the Skill belongs to */
  actorId: string;

  /** The name of the Skill on the Actor */
  skillName: SkillName;

  type: "skill";
}

/**
 * A custom typeguard, to check whether an unknown object is a SkillDragData.
 * @param data - the unknown object
 * @returns whether it is a SkillDragData
 */
export function isSkillDragData(
  data: Record<string, unknown>
): data is SkillDragData {
  return (
    data.type === "skill" &&
    typeof data.actorId === "string" &&
    typeof data.skillName === "string" &&
    isSkillName(data.skillName)
  );
}

/**
 * Options for modifying actor rolls.
 */
interface RollOptions {
  /**
   * An ad-hoc modifier to roll with. When undefined, no modifier is applied.
   * @defaultValue `undefined`
   */
  modifier?: number;

  /**
   * Whether to whisper the roll to GMs.
   * @defaultValue `false`
   */
  whisperToGms?: boolean;
}

/** The type of the update data for WvActors. */
export type UpdateData = DeepPartial<CharacterDataSource> & {
  _id: string | null;
};

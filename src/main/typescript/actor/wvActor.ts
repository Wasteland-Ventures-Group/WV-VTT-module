// vim: foldmethod=marker
import type { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import {
  CONSTANTS,
  isSkillName,
  isSpecialName,
  SkillName,
  SkillNames,
  SpecialName,
  SpecialNames
} from "../constants.js";
import {
  Criticals,
  SecondaryStatistics,
  Skill,
  Skills,
  Special
} from "../data/actor/properties.js";
import type { Resource } from "../data/foundryCommon.js";
import type DragData from "../dragData.js";
import Formulator from "../formulator.js";
import {
  getSkillMaxPoints,
  getSkillMinPoints,
  getSpecialMaxPoints,
  getSpecialMinPoints
} from "../helpers.js";
import { getGroundMoveRange, getGroundSprintMoveRange } from "../movement.js";
import type RuleElement from "../ruleEngine/ruleElement.js";
import WvI18n from "../wvI18n.js";
import type { PlayerCharacterDataSource } from "./../data/actor/source.js";

/* eslint-disable @typescript-eslint/member-ordering */

/** The basic Wasteland Ventures Actor. */
export default class WvActor extends Actor {
  // Data access {{{1

  // Main stats access {{{2

  // Getters {{{3

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

  // Update methods {{{3

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

  // Misc stats access {{{2

  /** Get the ground movement range of the actor. */
  get groundMoveRange(): number {
    return getGroundMoveRange(this);
  }

  /** Get the ground sprint movement range of the actor. */
  get groundSprintMoveRange(): number {
    return getGroundSprintMoveRange(this);
  }

  // Other access {{{2

  /** Get RuleElements that apply to this Actor. */
  get applicableRuleElements(): RuleElement[] {
    const rules: RuleElement[] = [];

    this.data.items.forEach((item) => {
      item.data.data.rules.elements.forEach((rule) => {
        if (rule.target === "actor") rules.push(rule);
      });
    });

    return rules;
  }

  // Rolls {{{1

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

  // Data computation {{{1

  override prepareBaseData(): void {
    this.computeBase();
  }

  override prepareEmbeddedDocuments(): void {
    super.prepareEmbeddedDocuments();
    this.applicableRuleElements
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => rule.onPrepareEmbeddedDocuments());
  }

  override prepareDerivedData(): void {
    this.computeBaseVitals();
    this.computeBaseSecondary();
    this.computeBaseSkills();
    this.applySizeModifiers();
  }

  // Computations before items {{{2

  /** Compute and set the Actor's derived statistics. */
  protected computeBase(): void {
    this.computeBaseLeveling();
    this.computeBaseSpecials();
  }

  // Leveling {{{3

  /** Compute and set the Actor's derived leveling statistics. */
  protected computeBaseLeveling(): void {
    const leveling = this.data.data.leveling;
    leveling.level = this.computeLevel();
    leveling.maxSkillPoints = this.computeBaseMaxSkillPoints();
  }

  /** Compute the level of the Actor. */
  protected computeLevel(): number {
    return Math.floor(
      (1 + Math.sqrt(this.data.data.leveling.experience / 12.5 + 1)) / 2
    );
  }

  /** Compute the base maximum skill points of the Actor. */
  protected computeBaseMaxSkillPoints(): number {
    return this.data.data.leveling.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  // SPECIALs {{{3

  protected computeBaseSpecials(): void {
    const specials = this.data.data.specials;
    for (const special of SpecialNames) {
      const points = this.data.data.leveling.specialPoints[special];
      specials[special] = new Special(points, points, points);
    }
  }

  // Computations after items {{{2

  // Vitals {{{3

  /** Compute and set the Actor's derived vitals statistics. */
  protected computeBaseVitals(): void {
    const vitals = this.data.data.vitals;
    vitals.hitPoints.max = this.computeBaseMaxHitPoints();
    vitals.healingRate = this.computeBaseHealingRate();
    vitals.actionPoints.max = this.computeBaseMaxActionPoints();
    vitals.strain.max = this.computeBaseMaxStrain();
    vitals.insanity.max = this.computeBaseMaxInsanity();
  }

  /** Compute the base healing rate of the actor. */
  protected computeBaseHealingRate(): number {
    const endurance = this.getSpecial("endurance");
    if (endurance.tempTotal >= 8) {
      return 3;
    } else if (endurance.tempTotal >= 4) {
      return 2;
    } else {
      return 1;
    }
  }

  /** Compute the base maximum action points of the Actor. */
  protected computeBaseMaxActionPoints(): number {
    return Math.floor(this.getSpecial("agility").tempTotal / 2) + 10;
  }

  /** Compute the base maximum health of the Actor. */
  protected computeBaseMaxHitPoints(): number {
    return this.getSpecial("endurance").permTotal + 10;
  }

  /** Compute the base maximum insanity of the Actor. */
  protected computeBaseMaxInsanity(): number {
    return Math.floor(this.getSpecial("intelligence").tempTotal / 2) + 5;
  }

  /**
   * Compute the base maximum strain of the Actor. This should be called after
   * the level of the Actor has been computed.
   */
  protected computeBaseMaxStrain(): number {
    const level = this.data.data.leveling.level;
    if (level === undefined)
      throw new Error("The level should be computed before computing strain.");

    return 20 + Math.floor(level / 5) * 5;
  }

  // Secondary {{{3

  /** Compute and set the Actor's derived secondary statistics. */
  protected computeBaseSecondary(): void {
    const secondary = new SecondaryStatistics();
    secondary.criticals = this.computeBaseCriticals();
    secondary.maxCarryWeight = this.computeBaseMaxCarryWeight();
    this.data.data.secondary = secondary;
  }

  /** Compute the base critical stats of the Actor. */
  protected computeBaseCriticals(): Criticals {
    const luck = this.getSpecial("luck").tempTotal;
    return new Criticals(Math.max(1, luck), Math.min(100, 90 + luck));
  }

  /** Compute the base maximum carry weight of the Actor in kg. */
  protected computeBaseMaxCarryWeight(): number {
    return this.getSpecial("strength").tempTotal * 5 + 10;
  }

  // Skills {{{3

  /** Compute and set the skill values of an actor. */
  protected computeBaseSkills(): void {
    this.data.data.skills = this.computeBaseSkillValues();
  }

  /** Compute the base skill values of an Actor. */
  protected computeBaseSkillValues(): Skills {
    const skills = new Skills();
    let skill: SkillName;
    for (skill in CONSTANTS.skillSpecials) {
      skills[skill] = this.computeBaseSkill(skill);
    }
    skills["thaumaturgy"] = this.computeBaseSkill("thaumaturgy");
    return skills;
  }

  /**
   * Compute the initial Skill for the given skill name. This includes the
   * SPECIAL derived starting value and the final value only increased by skill
   * point ranks.
   * @param skill - the name of the skill
   */
  protected computeBaseSkill(skill: SkillName): Skill {
    const baseSkill = this.computeSpecialSkillValue(skill);
    return new Skill(
      baseSkill,
      baseSkill + this.data.data.leveling.skillRanks[skill]
    );
  }

  /**
   * Compute the base skill value of an Actor, derived from SPECIAL.
   * @param skill - the name of the skill
   */
  protected computeSpecialSkillValue(skill: SkillName): number {
    const special: SpecialName =
      skill === "thaumaturgy"
        ? this.data.data.magic.thaumSpecial
        : CONSTANTS.skillSpecials[skill];
    return (
      this.getSpecial(special).permTotal * 2 +
      Math.floor(this.getSpecial("luck").permTotal / 2)
    );
  }

  /**
   * Apply the stat modifiers, based on the size category of the Actor.
   * @throws if max hit points or max carry weight are not defined
   */
  protected applySizeModifiers(): void {
    if (
      this.data.data.vitals.hitPoints.max === undefined ||
      this.data.data.secondary === undefined ||
      this.data.data.secondary.maxCarryWeight === undefined
    )
      throw new Error(
        "Max hit points and carry weight should be computed before size modifiers"
      );

    // TODO: hit chance, reach, combat trick mods
    switch (this.data.data.background.size) {
      case 4:
        this.data.data.vitals.hitPoints.max += 4;
        this.data.data.secondary.maxCarryWeight += 60;
        break;
      case 3:
        this.data.data.vitals.hitPoints.max += 2;
        this.data.data.secondary.maxCarryWeight += 40;
        break;
      case 2:
        this.data.data.vitals.hitPoints.max += 1;
        this.data.data.secondary.maxCarryWeight += 10;
        break;
      case 1:
        this.data.data.secondary.maxCarryWeight += 5;
        break;
      case -1:
        this.data.data.secondary.maxCarryWeight -= 5;
        break;
      case -2:
        this.data.data.vitals.hitPoints.max -= 1;
        this.data.data.secondary.maxCarryWeight -= 10;
        break;
      case -3:
        this.data.data.vitals.hitPoints.max -= 2;
        this.data.data.secondary.maxCarryWeight -= 40;
        break;
      case -4:
        this.data.data.vitals.hitPoints.max -= 4;
        this.data.data.secondary.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }
  }

  // Data Validation {{{1

  /**
   * Check whether the passed change data is valid.
   * @param change - the change data to validate
   * @returns whether the data is valid
   */
  validChangeData(
    change: DeepPartial<ConstructorParameters<typeof Actor>[0]>
  ): boolean {
    if (!this.validVitals(change)) return false;
    if (!this.validBackground(change)) return false;
    if (!this.validLeveling(change)) return false;
    if (!this.validSpecials(change)) return false;

    return true;
  }

  /**
   * Validate the vitals update data.
   * @param change - the change data to validate
   * @returns whether the data is valid
   */
  protected validVitals(
    change: DeepPartial<ConstructorParameters<typeof Actor>[0]>
  ): boolean {
    if (!change?.data) return true;

    if (change.data.vitals) {
      const vitals = change.data.vitals;
      const min = 0;

      if (vitals.hitPoints?.value && this.hitPoints.max) {
        const value = vitals.hitPoints.value;
        const max = this.hitPoints.max;
        if (!value.between(min, max)) return false;
      }

      if (vitals.actionPoints?.value && this.actionPoints.max) {
        const value = vitals.actionPoints.value;
        const max = this.actionPoints.max;
        if (!value.between(min, max)) return false;
      }

      if (vitals.strain?.value && this.strain.max) {
        const value = vitals.strain.value;
        const max = this.strain.max;
        if (!value.between(min, max)) return false;
      }
    }

    return true;
  }

  /**
   * Validate the background update data.
   * @param change - the change data to validate
   * @returns whether the data is valid
   */
  protected validBackground(
    change: DeepPartial<ConstructorParameters<typeof Actor>[0]>
  ): boolean {
    if (!change?.data) return true;

    if (change.data.background) {
      const background = change.data.background;

      if (background.karma) {
        const value = background.karma;
        const max = CONSTANTS.bounds.karma.max;
        const min = CONSTANTS.bounds.karma.min;
        if (!value.between(min, max)) return false;
      }
    }

    return true;
  }

  /**
   * Validate the leveling update data.
   * @param change - the change data to validate
   * @returns whether the data is valid
   */
  protected validLeveling(
    change: DeepPartial<ConstructorParameters<typeof Actor>[0]>
  ): boolean {
    if (!change?.data) return true;

    if (change.data.leveling) {
      const leveling = change.data.leveling;

      if (leveling.experience) {
        const value = leveling.experience;
        const max = CONSTANTS.bounds.experience.max;
        const min = CONSTANTS.bounds.experience.min;
        if (!value.between(min, max)) return false;
      }

      if (leveling.skillRanks) {
        const max = getSkillMaxPoints();
        const min = getSkillMinPoints();
        for (const skill of SkillNames) {
          const value = leveling.skillRanks[skill];
          if (value && !value.between(min, max)) return false;
        }
      }
    }

    return true;
  }

  /**
   * Validate the vitals update data.
   * @param change - the change data to validate
   * @returns whether the data is valid
   */
  protected validSpecials(
    change: DeepPartial<ConstructorParameters<typeof Actor>[0]>
  ): boolean {
    if (!change?.data) return true;

    if (change.data?.leveling?.specialPoints) {
      const max = getSpecialMaxPoints();
      const min = getSpecialMinPoints();
      for (const special of SpecialNames) {
        const value = change.data.leveling.specialPoints[special];
        if (value && !value.between(min, max)) return false;
      }
    }

    return true;
  }
  // }}}1
}

/* eslint-enable @typescript-eslint/member-ordering */

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
export type UpdateData = DeepPartial<PlayerCharacterDataSource> & {
  _id: string | null;
};

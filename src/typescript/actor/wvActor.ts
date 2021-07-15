// vim: foldmethod=marker
import { ConstructorDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import { CONSTANTS, SkillNames, SpecialNames } from "../constants.js";
import { Resource } from "../data/foundryCommon.js";
import { getGmIds } from "../helpers.js";
import WvI18n from "../wvI18n.js";
import {
  Resistances,
  SecondaryStatistics,
  Skill,
  Skills
} from "./../data/actorData.js";
import { PlayerCharacterDataSource } from "./../data/actorDbData.js";

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
    return this.actionPoints.value * 2;
  }

  /** Get the ground sprint movement range of the actor. */
  get groundSprintMoveRange(): number {
    const actionPoints =
      this.actionPoints.value +
      Math.floor(this.data.data.specials.endurance / 2);
    return actionPoints * 2;
  }

  // Rolls {{{1

  /**
   * Roll a SPECIAL for this Actor.
   * @param special - the name of the SPECIAL to roll
   */
  rollSpecial(special: SpecialNames, options?: RollOptions): void {
    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSpecialRollFlavor(special),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };
    if (options?.whisperToGms) {
      msgOptions["whisper"] = getGmIds();
    }

    new Roll(`1d100cs<=(${this.data.data.specials[special]}*10)`)
      .roll({ async: true })
      .then((r) => r.toMessage(msgOptions));
  }

  /**
   * Roll a Skill for this Actor.
   * @param skill - the name of the Skill to roll
   */
  rollSkill(skill: SkillNames, options?: RollOptions): void {
    const skillTotal = this.data.data.skills[skill]?.total;
    if (!skillTotal) throw "The skills have not been calculated yet!";

    const msgOptions: ConstructorDataType<foundry.data.ChatMessageData> = {
      flavor: WvI18n.getSkillRollFlavor(skill),
      speaker: ChatMessage.getSpeaker({ actor: this })
    };
    if (options?.whisperToGms) {
      msgOptions["whisper"] = getGmIds();
    }

    new Roll(`1d100cs=<${skillTotal}`)
      .roll({ async: true })
      .then((r) => r.toMessage(msgOptions));
  }

  // Data computation {{{1

  override prepareBaseData(): void {
    this.computeBase();
  }

  override prepareDerivedData(): void {
    this.applySizeModifiers();
  }

  // Computations before items {{{2

  /** Compute and set the Actor's derived statistics. */
  protected computeBase(): void {
    this.computeBaseLeveling();
    this.computeBaseVitals();
    this.computeBaseSecondary();
    this.data.data.resistances = new Resistances();
    this.computeBaseSkills();
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
    if (this.data.data.specials.endurance >= 8) {
      return 3;
    } else if (this.data.data.specials.endurance >= 4) {
      return 2;
    } else {
      return 1;
    }
  }

  /** Compute the base maximum action points of the Actor. */
  protected computeBaseMaxActionPoints(): number {
    return Math.floor(this.data.data.specials.agility / 2) + 10;
  }

  /** Compute the base maximum health of the Actor. */
  protected computeBaseMaxHitPoints(): number {
    return this.data.data.specials.endurance + 10;
  }

  /** Compute the base maximum insanity of the Actor. */
  protected computeBaseMaxInsanity(): number {
    return Math.floor(this.data.data.specials.intelligence / 2) + 5;
  }

  /**
   * Compute the base maximum strain of the Actor. This should be called after
   * the level of the Actor has been computed.
   */
  protected computeBaseMaxStrain(): number {
    if (this.data.data.leveling.level === undefined) {
      throw "The level should be computed before computing strain.";
    }
    return 20 + Math.floor(this.data.data.leveling.level / 5) * 5;
  }

  // Secondary {{{3

  /** Compute and set the Actor's derived secondary statistics. */
  protected computeBaseSecondary(): void {
    const secondary = new SecondaryStatistics();
    secondary.maxCarryWeight = this.computeBaseMaxCarryWeight();
    this.data.data.secondary = secondary;
  }

  /** Compute the base maximum carry weight of the Actor in kg. */
  protected computeBaseMaxCarryWeight(): number {
    return this.data.data.specials.strength * 5 + 10;
  }

  // Skills {{{3

  /** Compute and set the skill values of an actor. */
  protected computeBaseSkills(): void {
    this.data.data.skills = this.computeBaseSkillValues();
  }

  /** Compute the base skill values of an Actor. */
  protected computeBaseSkillValues(): Skills {
    const skills = new Skills();
    let skill: SkillNames;
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
  protected computeBaseSkill(skill: SkillNames): Skill {
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
  protected computeSpecialSkillValue(skill: SkillNames): number {
    const special: SpecialNames =
      skill === "thaumaturgy"
        ? this.data.data.magic.thaumSpecial
        : CONSTANTS.skillSpecials[skill];
    return (
      this.data.data.specials[special] * 2 +
      Math.floor(this.data.data.specials.luck / 2)
    );
  }

  // Computations after items {{{2

  /**
   * Apply the stat modifiers, based on the size category of the Actor.
   * @throws if max hit points or max carry weight are not defined
   */
  protected applySizeModifiers(): void {
    if (
      this.data.data.vitals.hitPoints.max === undefined ||
      this.data.data.secondary === undefined ||
      this.data.data.secondary.maxCarryWeight === undefined
    ) {
      throw "Max hit points and carry weight should be computed before size modifiers";
    }

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

  // }}}1
}

/**
 * Options for modifying actor rolls.
 */
interface RollOptions {
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

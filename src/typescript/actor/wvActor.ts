import { CONSTANTS, SkillNames, SpecialNames } from "../constants.js";
import {
  Resistances,
  SecondaryStatistics,
  Skill,
  Skills,
  WvActorDerivedData
} from "./../data/actorData.js";
import { WvActorDbData } from "./../data/actorDbData.js";
import WvItem from "./../item/wvItem.js";

/** The basic Wasteland Ventures Actor. */
export default class WvActor extends Actor<
  WvActorDbData,
  WvItem,
  WvActorDerivedData
> {
  /** @override */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  prepareBaseData() {
    this.computeBase();
  }

  /** @override */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  prepareDerivedData() {
    this.applySizeModifiers();
  }

  // ===========================================================================
  // = Calculations before items
  // ===========================================================================

  /** Compute and set the Actor's derived statistics. */
  protected computeBase(): void {
    this.computeBaseLeveling();
    this.computeBaseVitals();
    this.computeBaseSecondary();
    this.data.data.resistances = new Resistances();
    this.computeBaseSkills();
  }

  // = Leveling ================================================================

  /** Compute and set the Actor's derived leveling statistics. */
  protected computeBaseLeveling(): void {
    const leveling = this.data.data.leveling;
    leveling.level = this.computeLevel();
    leveling.maxSkillPoints = this.computeBaseMaxSkillPoints();
  }

  /** Compute the level of the Actor. */
  protected computeLevel(): number {
    return Math.floor(
      (1 + Math.sqrt(this._data.data.leveling.experience / 12.5 + 1)) / 2
    );
  }

  /** Compute the base maximum skill points of the Actor. */
  protected computeBaseMaxSkillPoints(): number {
    return this._data.data.leveling.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  // = Vitals ==================================================================

  /** Compute and set the Actor's derived vitals statistics. */
  protected computeBaseVitals(): void {
    const vitals = this.data.data.vitals;
    vitals.maxHitPoints = this.computeBaseMaxHitPoints();
    vitals.healingRate = this.computeBaseHealingRate();
    vitals.maxActionPoints = this.computeBaseMaxActionPoints();
    vitals.maxStrain = this.computeBaseMaxStrain();
    vitals.maxInsanity = this.computeBaseMaxInsanity();
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

  // = Secondary ===============================================================

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

  // = Skills ==================================================================

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

  // ===========================================================================
  // = Calculations after items
  // ===========================================================================

  /**
   * Apply the stat modifiers, based on the size category of the Actor.
   * @throws if max hit points or max carry weight are not defined
   */
  protected applySizeModifiers(): void {
    if (
      this.data.data.vitals.maxHitPoints === undefined ||
      this.data.data.secondary === undefined ||
      this.data.data.secondary.maxCarryWeight === undefined
    ) {
      throw "Max hit points and carry weight should be computed before size modifiers";
    }

    // TODO: hit chance, reach, combat trick mods
    switch (this.data.data.background.size) {
      case 4:
        this.data.data.vitals.maxHitPoints += 4;
        this.data.data.secondary.maxCarryWeight += 60;
        break;
      case 3:
        this.data.data.vitals.maxHitPoints += 2;
        this.data.data.secondary.maxCarryWeight += 40;
        break;
      case 2:
        this.data.data.vitals.maxHitPoints += 1;
        this.data.data.secondary.maxCarryWeight += 10;
        break;
      case 1:
        this.data.data.secondary.maxCarryWeight += 5;
        break;
      case -1:
        this.data.data.secondary.maxCarryWeight -= 5;
        break;
      case -2:
        this.data.data.vitals.maxHitPoints -= 1;
        this.data.data.secondary.maxCarryWeight -= 10;
        break;
      case -3:
        this.data.data.vitals.maxHitPoints -= 2;
        this.data.data.secondary.maxCarryWeight -= 40;
        break;
      case -4:
        this.data.data.vitals.maxHitPoints -= 4;
        this.data.data.secondary.maxCarryWeight -= 60;
        break;
      case 0:
      default:
    }
  }
}

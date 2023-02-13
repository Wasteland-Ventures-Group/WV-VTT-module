import AttacksSource, { AttackSource, DamageSource } from "./source.js";
import { CompositeNumber } from "../../../common.js";
import type WvActor from "../../../../actor/wvActor.js";
import type Weapon from "../../../../item/weapon.js";
import {
  CONSTANTS,
  isRangePickingTag,
  RangeBracket
} from "../../../../constants.js";
import AttackExecution from "../../../../item/weapon/attackExecution.js";

export default class AttacksProperties extends AttacksSource {
  constructor(source: AttacksSource, owningWeapon: Weapon) {
    super();
    foundry.utils.mergeObject(this, source);
    Object.entries(source.sources).forEach(([name, source]) => {
      this.attacks[name] = new AttackProperties(name, source, owningWeapon);
    });
  }

  /** The Weapon Attacks, created from the sources */
  attacks: Record<string, AttackProperties> = {};

  /** Get all attacks matching the given tags. */
  getMatching(tags: string[] | undefined): AttackProperties[] {
    return Object.values(this.attacks).filter((attack) => attack.matches(tags));
  }

  /**
   * Apply a skill damage dice modifier to all attacks, if the attack qualifies
   * for it. This is based on the skill of the weapon and the skill value of the
   * given Actor.
   */
  applySkillDamageDiceMod(actor: WvActor | null, weapon: Weapon): void {
    if (!actor) return;

    Object.values(this.attacks).forEach((attack) =>
      attack.damage.applySkillDamageDiceMod(actor, weapon)
    );
  }

  /**
   * Apply a Strength damage dice modifier to all attacks, based on the Strength
   * of the given Actor.
   */
  applyStrengthDamageDiceMod(actor: WvActor | null): void {
    if (!actor) return;

    Object.values(this.attacks).forEach((attack) =>
      attack.damage.applyStrengthDamageDiceMod(actor)
    );
  }
}

export class AttackProperties extends AttackSource {
  constructor(name: string, source: AttackSource, owningWeapon: Weapon) {
    super();
    foundry.utils.mergeObject(this, source);
    this.damage = new DamageProperties(source.damage, owningWeapon);

    this.rounds = CompositeNumber.from(source.rounds ?? { source: 0 });
    this.rounds.bounds.min = 0;

    this.dtReduction = CompositeNumber.from(
      source.dtReduction ?? { source: 0 }
    );

    this.ap = CompositeNumber.from(source.ap);
    this.ap.bounds.min = 0;

    this.#weapon = owningWeapon;
    this.#name = name;
  }

  override damage: DamageProperties;

  override rounds: CompositeNumber;

  override dtReduction: CompositeNumber;

  override ap: CompositeNumber;

  #weapon: Weapon;

  #name: string;

  /** Get the range picking relevant tags for this attack. */
  get rangePickingTags(): string[] {
    return this.tags.filter(isRangePickingTag);
  }

  /** Check whether this attack matches the given list of tags. */
  matches(tags: string[] | undefined): boolean {
    if (tags === undefined) return true;

    return !tags.some((tag) => !this.tags.includes(tag));
  }

  async execute(doPrompt: boolean): Promise<void> {
    await AttackExecution.execute(this.#name, this, this.#weapon, doPrompt);
  }
}

export class DamageProperties extends DamageSource {
  constructor(source: DamageSource, owningWeapon: Weapon) {
    super();
    foundry.utils.mergeObject(this, source);

    this.base = CompositeNumber.from(source.base);
    this.base.bounds.min = 0;

    this.dice = CompositeNumber.from(source.dice);
    this.dice.bounds.min = 0;

    this.#weapon = owningWeapon;
  }

  override base: CompositeNumber;

  override dice: CompositeNumber;

  #weapon: Weapon;

  /** Get the system formula representation of the damage of this attack. */
  get damageFormula(): string {
    if (!this.diceRange || this.#weapon.actor)
      return `${this.base.total}+(${this.dice.total})`;

    const low =
      this.dice.total +
      this.getStrengthDamageDiceMod(CONSTANTS.bounds.special.value.min);
    const high =
      this.dice.total +
      this.getStrengthDamageDiceMod(CONSTANTS.bounds.special.value.max);
    return `${this.base.total}+(${low}-${high})`;
  }

  /**
   * Get the string representation of the potential damage range of the attack.
   */
  get damageRange(): string {
    const low = this.base.total;
    let high = low + this.dice.total;

    if (this.diceRange && !this.#weapon.actor) {
      high += this.getStrengthDamageDiceMod(CONSTANTS.bounds.special.value.max);
    }

    return `${low} - ${high}`;
  }

  /** Get a copy of this damage's dice modified by a range damage modifier. */
  getRangeModifiedDamageDice(range: RangeBracket): CompositeNumber {
    const damageDice = this.dice.clone();

    const value = this.getRangeDamageDiceMod(range);
    if (value)
      damageDice.add({
        value,
        labelComponents: [
          { key: "wv.rules.range.singular" },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });

    return damageDice;
  }

  /**
   * Apply a skill damage dice modifier to the attack, based on the skill of
   * the weapon and the skill value of the given Actor.
   */
  applySkillDamageDiceMod(actor: WvActor, weapon: Weapon): void {
    const value = this.getSkillDamageDiceMod(
      actor.data.data.skills[weapon.data.data.skill].total
    );
    if (value)
      this.dice.add({
        value,
        labelComponents: [
          { key: `wv.rules.skills.names.${weapon.data.data.skill}` },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });
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
      this.dice.add({
        value,
        labelComponents: [
          { key: "wv.rules.special.names.strength.long" },
          { text: "-" },
          { key: "wv.rules.damage.damageDice" }
        ]
      });
  }

  /** Get the range damage modifier dice for the given range bracket. */
  private getRangeDamageDiceMod(range: RangeBracket): number {
    if (this.damageFallOff === "shotgun") {
      switch (range) {
        case RangeBracket.LONG:
          return -4;
        case RangeBracket.MEDIUM:
          return -2;
      }
    }

    return 0;
  }

  /** Get the "skillful" skill-based damage dice modifier value. */
  private getSkillDamageDiceMod(skill: number): number {
    return Math.floor(skill / 20);
  }

  /** Get the Strength damage modifier dice for the given Strength value. */
  private getStrengthDamageDiceMod(strength: number): number {
    if (!this.diceRange) {
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
}

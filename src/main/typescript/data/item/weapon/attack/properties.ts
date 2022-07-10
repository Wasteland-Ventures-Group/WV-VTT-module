import Attack from "../../../../item/weapon/attack.js";
import AttacksSource, { AttackSource, DamageSource } from "./source.js";
import type Weapon from "../../../../item/weapon.js";
import { CompositeNumber } from "../../../common.js";

export default class Attacks extends AttacksSource {
  constructor(source: AttacksSource, owningWeapon: Weapon) {
    super();
    foundry.utils.mergeObject(this, source);
    Object.entries(source.sources).forEach(
      ([name, source]) =>
        (this.attacks[name] = new Attack(
          name,
          new AttackProperties(source),
          owningWeapon
        ))
    );
  }

  /** The Weapon Attacks, created from the sources */
  attacks: Record<string, Attack> = {};

  /** Get all attacks matching the given tags. */
  getMatching(tags: string[] | undefined): Attack[] {
    return Object.values(this.attacks).filter((attack) => attack.matches(tags));
  }
}

export class AttackProperties extends AttackSource {
  constructor(source: AttackSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.damage = new DamageProperties(source.damage);
    this.rounds = CompositeNumber.from(source.rounds ?? { source: 0 });
    this.dtReduction = CompositeNumber.from(
      source.dtReduction ?? { source: 0 }
    );
    this.ap = CompositeNumber.from(source.ap);
  }

  override damage: DamageProperties;

  override rounds: CompositeNumber;

  override dtReduction: CompositeNumber;

  override ap: CompositeNumber;
}

export class DamageProperties extends DamageSource {
  constructor(source: DamageSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.base = CompositeNumber.from(source.base);
    this.dice = CompositeNumber.from(source.dice);
  }

  override base: CompositeNumber;

  override dice: CompositeNumber;
}

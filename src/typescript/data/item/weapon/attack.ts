import type Attack from "../../../item/weapon/attack.js";
import type { AttackSource } from "../../../item/weapon/attack.js";

/** A Weapon Attacks DB container */
export class DbAttacks {
  /** The source objects for the Attacks */
  sources: AttackSource[] = [];
}

/** A Weapon Attacks container */
export class Attacks extends DbAttacks {
  /** The Weapon Attacks, created from the sources */
  attacks: Attack[] = [];
}

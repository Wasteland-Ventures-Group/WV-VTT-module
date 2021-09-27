import type Attack from "../../../item/weapon/attack.js";
import type { AttackSource } from "../../../item/weapon/attack.js";

/** A Weapon Attacks DB container */
export class AttacksSource {
  /** The source objects for the Attacks */
  sources: Record<string, AttackSource> = {};
}

/** A Weapon Attacks container */
export class Attacks extends AttacksSource {
  /** The Weapon Attacks, created from the sources */
  attacks: Record<string, Attack> = {};
}

import type Attack from "../../../../item/weapon/attack.js";
import AttacksSource from "./source.js";

/** A Weapon Attacks container */
export default class Attacks extends AttacksSource {
  /** The Weapon Attacks, created from the sources */
  attacks: Record<string, Attack> = {};
}

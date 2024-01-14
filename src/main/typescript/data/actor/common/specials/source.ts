import type { SpecialName } from "../../../../constants";
import { Special } from "./properties";

/** A source class for SPECIALs. Not to be used on Characters (as they handle
 * SPECIALs through levelling properties. */
export default class SpecialsSource implements Record<SpecialName, Special> {
  /** The Strength SPECIAL of the character */
  strength = new Special();

  /** The Perception SPECIAL of the character */
  perception = new Special();

  /** The Endurance SPECIAL of the character */
  endurance = new Special();

  /** The Charisma SPECIAL of the character */
  charisma = new Special();

  /** The Intelligence SPECIAL of the character */
  intelligence = new Special();

  /** The Agility SPECIAL of the character */
  agility = new Special();

  /** The Luck SPECIAL of the character */
  luck = new Special();
}

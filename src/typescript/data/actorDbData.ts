import { WvItemDbData } from "./itemDbData";

/**
 * This is an interface to represent a set of SPECIAL values in general under
 * the rules of the Wasteland Ventures ruleset.
 */
export interface Special {
  /**
   * The current base Strength of an Actor
   */
  strenght: number;

  /**
   * The current base Perception of an Actor
   */
  perception: number;

  /**
   * The current base Endurance of an Actor
   */
  endurance: number;

  /**
   * The current base Charisma of an Actor
   */
  charisma: number;

  /**
   * The current base Intelligence of an Actor
   */
  intelligence: number;

  /**
   * The current base Agility of an Actor
   */
  agility: number;

  /**
   * The current base Luck of an Actor
   */
  luck: number;
}

/**
 * This is the "vitals" template for {@link Actor}s from the `template.json`
 * file.
 */
export interface Vitals {
  /**
   * The current amount of hit points of an Actor
   */
  hitPoints: number;

  /**
   * The current amount of action points of an Actor
   */
  actionPoints: number;

  /**
   * The current insanity of an Actor
   */
  insanity: number;
}

/**
 * This is the "leveling" template for {@link Actor}s from the `template.json`
 * file.
 */
export interface Leveling {
  /**
   * The current experience of an Actor
   */
  experience: number;

  /**
   * The skill point relevant intelligence values at each level up of an Actor
   */
  levelIntelligences: number[];
}

/**
 * This is the "resistances" template for {@link Actor}s from the
 * `template.json` file.
 */
export interface Resistances {
  /**
   * The base poison resistance of an Actor
   */
  poison: number;

  /**
   * The base radiation resistance of an Actor
   */
  radiation: number;
}

/**
 * This is the "background" template for {@link Actor}s from the `template.json`
 * file.
 */
export interface Background {
  /**
   * The name of an Actor
   */
  name: string;

  /**
   * The background of an Actor
   */
  background: string;

  /**
   * The history of an Actor
   */
  history: string;

  /**
   * The fears of an Actor
   */
  fears: string;

  /**
   * The dreams of an Actor
   */
  dreams: string;

  /**
   * The current karma of an Actor
   */
  karma: number;

  /**
   * The current size of an Actor
   */
  size: number;
}

/**
 * The system specific database data of Wasteland Ventures actors.
 */
export type WvActorDbDataData = Special & Vitals & Leveling & Background;

/**
 * The database data of Wasteland Ventures actors.
 */
export type WvActorDbData = Actor.Data<WvActorDbDataData, WvItemDbData>;

import { TemplateEntityType } from "./common.js";
import { WvItemDbData } from "./itemDbData.js";

/**
 * This is an interface to represent a set of SPECIAL values in general under
 * the rules of the Wasteland Ventures ruleset.
 */
export class Special {
  constructor(
    /**
     * The current base Strength of an Actor
     */
    public strength: number = 5,

    /**
     * The current base Perception of an Actor
     */
    public perception: number = 5,

    /**
     * The current base Endurance of an Actor
     */
    public endurance: number = 5,

    /**
     * The current base Charisma of an Actor
     */
    public charisma: number = 5,

    /**
     * The current base Intelligence of an Actor
     */
    public intelligence: number = 5,

    /**
     * The current base Agility of an Actor
     */
    public agility: number = 5,

    /**
     * The current base Luck of an Actor
     */
    public luck: number = 5
  ) {}
}

/**
 * This is the "vitals" template for {@link Actor}s from the `template.json`
 * file.
 */
export class Vitals {
  constructor(
    /**
     * The current amount of hit points of an Actor
     */
    public hitPoints: number = 10,

    /**
     * The current amount of action points of an Actor
     */
    public actionPoints: number = 10,

    /**
     * The current insanity of an Actor
     */
    public insanity: number = 0
  ) {}
}

/**
 * This is the "leveling" template for {@link Actor}s from the `template.json`
 * file.
 */
export class Leveling {
  constructor(
    /**
     * The current experience of an Actor
     */
    public experience: number = 0,

    /**
     * The skill point relevant intelligence values at each level up of an Actor
     */
    public levelIntelligences: number[] = []
  ) {}
}

/**
 * This is the "resistances" template for {@link Actor}s from the
 * `template.json` file.
 */
export class Resistances {
  constructor(
    /**
     * The base poison resistance of an Actor
     */
    public poison: number = 10,

    /**
     * The base radiation resistance of an Actor
     */
    public radiation: number = 5
  ) {}
}

/**
 * This is the "background" template for {@link Actor}s from the `template.json`
 * file.
 */
export class Background {
  constructor(
    /**
     * The name of an Actor
     */
    public name: string = "",

    /**
     * The background of an Actor
     */
    public background: string = "",

    /**
     * The history of an Actor
     */
    public history: string = "",

    /**
     * The fears of an Actor
     */
    public fears: string = "",

    /**
     * The dreams of an Actor
     */
    public dreams: string = "",

    /**
     * The current karma of an Actor
     */
    public karma: number = 0,

    /**
     * The current size of an Actor
     */
    public size: number = 0
  ) {}
}

/**
 * The system specific database data of Wasteland Ventures actors.
 */
export class WvActorDbDataData implements TemplateEntityType {
  constructor(
    public special: Special = new Special(),
    public vitals: Vitals = new Vitals(),
    public leveling: Leveling = new Leveling(),
    public background: Background = new Background()
  ) {}

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getTypeName() {
    return "playerCharacter";
  }
}

/**
 * The database data of Wasteland Ventures actors.
 */
export type WvActorDbData = Actor.Data<WvActorDbDataData, WvItemDbData>;

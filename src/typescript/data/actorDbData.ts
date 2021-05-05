import { ThaumaturgySpecials } from "../constants.js";
import { TemplateEntityType } from "./common.js";
import { WvItemDbData } from "./itemDbData.js";

/**
 * This is the "specials" template for {@link Actor}s from the `template.json`
 * file.
 */
export class Specials {
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
    public insanity: number = 0,

    /**
     * The current strain of an Actor
     */
    public strain: number = 20
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

export class Magic {
  constructor(
    /**
     * The SPECIAL associated with the Thaumaturgy skill
     */
    public thaumSpecial: ThaumaturgySpecials = "intelligence"
  ) {}
}

/**
 * The system specific database data of Wasteland Ventures actors.
 */
export class WvActorDbDataData implements TemplateEntityType {
  constructor(
    /** The SPECIALs of an Actor */
    public specials: Specials = new Specials(),

    /** The vitals of an Actor */
    public vitals: Vitals = new Vitals(),

    /** The leveling stats of an Actor */
    public leveling: Leveling = new Leveling(),

    /** The magic stats of an Actor */
    public magic: Magic = new Magic(),

    /** The background of an Actor */
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

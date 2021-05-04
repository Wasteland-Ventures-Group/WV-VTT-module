import {
  Background,
  Leveling as DbLeveling,
  Specials as DbSpecials,
  Vitals as DbVitals,
  WvActorDbDataData
} from "./actorDbData.js";
import { WvItemDbData } from "./itemDbData.js";

/**
 * Derived SPECIALs related data
 */
export class Specials extends DbSpecials {}

/**
 * Derived vitals data
 */
export class Vitals extends DbVitals {
  constructor(
    /**
     * The healing rate of an Actor per 8 hours of rest
     */
    public healingRate?: number,

    /**
     * The current maximum action points of an Actor
     */
    public maxActionPoints?: number,

    /**
     * The maximum hit points of an Actor
     */
    public maxHitPoints?: number,

    /**
     * The maximum insanity of an Actor
     */
    public maxInsanity?: number,

    /**
     * The maximum strain of an Actor
     */
    public maxStrain?: number
  ) {
    super();
  }
}

/**
 * Derived leveling related data
 */
export class Leveling extends DbLeveling {
  constructor(
    /**
     * The current level of an Actor
     */
    public level?: number,

    /**
     * The maximum skill points of an Actor
     */
    public maxSkillPoints?: number
  ) {
    super();
  }
}

/**
 * Derived resistance values
 */
export class Resistances {
  constructor(
    /**
     * The basic poison resitance of an Actor
     */
    public poison: number = 10,

    /**
     * The basic radiation resistance of an Actor
     */
    public radiation: number = 5
  ) {}
}

/**
 * Derived secondary statistics
 */
export class SecondaryStatistics {
  constructor(
    /**
     * The maximum carry weight of an Actor in kg
     */
    public maxCarryWeight?: number
  ) {}
}

export class WvActorDerivedDataData extends WvActorDbDataData {
  constructor(
    /** The SPECIALs of an Actor */
    public specials: Specials = new Specials(),

    /** The vitals of an Actor */
    public vitals: Vitals = new Vitals(),

    /** The leveling stats of an Actor */
    public leveling: Leveling = new Leveling(),

    /** The background of an Actor */
    public background: Background = new Background(),

    /** The resistances of an Actor */
    public resistances: Resistances | undefined = new Resistances(),

    /** The secondary statistics of an Actor */
    public secondary:
      | SecondaryStatistics
      | undefined = new SecondaryStatistics()
  ) {
    super(specials, vitals, leveling, background);
  }
}

/**
 * The derived data of Wasteland Ventures actors.
 */
export type WvActorDerivedData = Actor.Data<
  WvActorDerivedDataData,
  WvItemDbData
>;

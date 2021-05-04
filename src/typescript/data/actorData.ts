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
    public specials: Specials = new Specials(),
    public vitals: Vitals = new Vitals(),
    public leveling: Leveling = new Leveling(),
    public background: Background = new Background(),
    public secondary: SecondaryStatistics = new SecondaryStatistics()
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

import { WvActorDbDataData } from "./actor-db-data";
import { WvItemDbData } from "./item-db-data";

/**
 * The derived internal data of Wasteland Ventures actors
 */
export interface WvActorDerivedDataData extends WvActorDbDataData {
  /**
   * The healing rate of an Actor per 8 hours of rest
   */
  healingRate: number;

  /**
   * The current level of an Actor
   */
  level: number;

  /**
   * The current maximum action points of an Actor
   */
  maxActionPoints: number;

  /**
   * The maximum carry weight of an Actor in kg
   */
  maxCarryWeight: number;

  /**
   * The maximum hit points of an Actor
   */
  maxHitPoints: number;

  /**
   * The maximum insanity of an Actor
   */
  maxInsanity: number;

  /**
   * The maximum skill points of an Actor
   */
  maxSkillPoints: number;

  /**
   * The maximum strain of an Actor
   */
  maxStrain: number;
}

/**
 * The derived data of Wasteland Ventures actors.
 */
export type WvActorDerivedData = Actor.Data<
  WvActorDerivedDataData,
  WvItemDbData
>;

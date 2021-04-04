import { WvActorDbDataData } from './actor-db-data';
import { WvItemDbData } from './item-db-data';

/**
 * The derived data of Wasteland Ventures actors
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

export interface WvActorDerivedData
  extends Actor.Data<WvActorDerivedDataData, WvItemDbData> {}

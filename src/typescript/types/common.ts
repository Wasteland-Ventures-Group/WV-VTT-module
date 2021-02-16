import * as foundry from './foundry-common';

/**
 * This is a {@link foundry.Resource} with an additional modifier.
 */
export interface ModdedResource extends foundry.Resource {
  /**
   * The modifier value of a resource
   */
  mod: number;
}

/**
 * This is an interface to represent a set of SPECIAL values in general under the
 * rules of the Wasteland Ventures ruleset.
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
   * The current base Luck of an Actor
   */
  luck: number;
}

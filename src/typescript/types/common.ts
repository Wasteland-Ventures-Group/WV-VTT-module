import * as foundry from './foundry-common';

/**
 * This is a {@link foundry.Resource} with an additional modifier.
 */
export interface ModdedResource extends foundry.Resource {
  mod: number;
}

/**
 * This is an interface to represent a set of SPECIAL values in general under the
 * rules of the Wasteland Ventures ruleset.
 */
export interface Special {
  strenght: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  luck: number;
}

import * as foundry from "./foundryCommon.js";

/**
 * This is a {@link foundry.Resource} with an additional modifier.
 */
export interface ModdedResource extends foundry.Resource {
  /**
   * The modifier value of a resource
   */
  mod: number;
}

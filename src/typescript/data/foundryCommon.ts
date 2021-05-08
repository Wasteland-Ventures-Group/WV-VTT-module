/**
 * An interface of what Foundry VTT will automatically recognize as a
 * "resource".
 */
export interface Resource {
  /** The current value of a resource */
  value: number;

  /** The maximum value of a resource */
  max: number;
}

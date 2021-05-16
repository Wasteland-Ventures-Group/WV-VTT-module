/**
 * A class for what Foundry VTT will automatically recognize as a "resource".
 */
export class Resource {
  constructor(
    /** The current value of a resource */
    public value: number,

    /** The maximum value of a resource */
    public max?: number
  ) {}
}

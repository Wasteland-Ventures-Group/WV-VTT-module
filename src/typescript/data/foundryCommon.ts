import type { TYPES } from "../constants.js";

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

export interface FoundryCompendiumData<T> {
  _id: FoundryId;
  name: string;
  type: ValueOf<typeof TYPES.ACTOR | typeof TYPES.ITEM>;
  data: T;
  img: string;
  effects: unknown[];
  flags: Record<string, unknown>;
}

type FoundryId = string;

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

/** An interface to model Foundry's compendium layout. */
export interface FoundryCompendiumData<T> {
  /**
   * The data base ID. It needs to be unique per compendium and should match the
   * regular expression: `/^[a-zA-Z0-9]{16}$/`
   */
  _id: string;
  /** The name of the entry in the compendium */
  name: string;
  /** The Actor or Item type name */
  type: ValueOf<typeof TYPES.ACTOR | typeof TYPES.ITEM>;
  /** The entry's system data */
  data: T;
  /** The image of the entry */
  img: string;
  /** Foundry Active Effects on the entry */
  effects: unknown[];
  /** The sort order of the entry */
  sort: number;
  /** Custom flags on the entry */
  flags: Record<string, unknown>;
}

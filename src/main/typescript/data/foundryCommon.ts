import type { JSONSchemaType } from "ajv";
import { TYPES } from "../constants.js";

/** The source data of a foundry resource. */
export interface ResourceSource {
  value: number;
}

/**
 * A class for what Foundry VTT will automatically recognize as a "resource",
 * used in token bars for example.
 */
export class Resource implements ResourceSource {
  /**
   * Test whether the given source is a ResourceSource.
   * @param source - the source to test
   * @returns whether the source is a ResourceSource
   */
  static isSource(source: unknown): source is ResourceSource {
    return (
      typeof source === "object" &&
      null !== source &&
      "value" in source &&
      typeof (source as ResourceSource).value === "number"
    );
  }

  /**
   * Create a Resource from the given source
   * @param source - either a Resource or ResourceSource
   * @returns the created Resource
   * @throws if the given source is neither a Resource or ResourceSource
   */
  static from(source: unknown): Resource {
    if (source instanceof Resource) return source;

    if (this.isSource(source)) {
      return new Resource(source.value, source.value);
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /** Create a new Resource with the given value and maximum. */
  constructor(
    /** The current value of a resource */
    public value: number,

    /** The maximum value of a resource */
    public max: number
  ) {}
}

export const RESOURCE_SOURCE_JSON_SCHEMA: JSONSchemaType<ResourceSource> = {
  description: "A schema for a Foundry resource",
  type: "object",
  properties: {
    value: { type: "number", minimum: 0 }
  },
  required: ["value"],
  additionalProperties: false
};

/** An interface to model Foundry's compendium layout. */
export interface FoundryCompendiumData<T> {
  /** The NeDB database ID of the entry */
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
  effects: object[];
  /** Custom flags on the entry */
  flags: Record<string, unknown>;
}

/**
 * A JSON schema for Foundry compendium entries. The data property has to be
 * defined by users.
 */
export const COMPENDIUM_JSON_SCHEMA = {
  description: "An entry in a Foundry NeDB based compendium",
  type: "object",
  properties: {
    _id: {
      description:
        "The database ID. It needs to be unique per compendium and should " +
        "match the regular expression: `/^[a-zA-Z0-9]{16}$/`",
      type: "string",
      pattern: "^[a-zA-Z0-9]{16}$",
      default: ""
    },
    name: {
      description:
        "The name of the entry in the compendium. This is also the name of " +
        "the specific Document instance, that players can change to a custom " +
        "one. A custom or unique Document should have it's unique name set " +
        "here.",
      type: "string",
      default: ""
    },
    type: {
      description:
        "The type of the compendium entry. This should correspond to the " +
        "type of the compendium itself and be one of the defined types of " +
        "the system.",
      type: "string",
      enum: [...Object.values(TYPES.ACTOR), ...Object.values(TYPES.ITEM)],
      default: ""
    },
    data: {
      description: "The system data, specific to the type of the entry",
      type: "object",
      default: {}
    },
    img: {
      description:
        "An image path for the entry. This can be left blank. Otherwise it " +
        "should be a path to an image file, that users can fetch from the " +
        "game server.",
      type: "string",
      default: ""
    },
    effects: {
      description: "Foundry active effects on the entry",
      type: "array",
      items: { type: "object" }
    },
    flags: {
      description: "Custom flags on the entry",
      type: "object",
      default: {}
    }
  },
  required: ["_id", "name", "type", "data", "img", "effects", "flags"],
  additionalProperties: false,
  default: {
    _id: "",
    name: "",
    type: "",
    data: {},
    img: "",
    effects: [],
    flags: {}
  }
} as const;

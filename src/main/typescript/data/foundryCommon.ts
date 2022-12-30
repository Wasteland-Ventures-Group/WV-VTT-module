import type { DocumentDataType } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs.js";
import type { JSONSchemaType } from "ajv";
import { z } from "zod";
import {
  SystemDocumentType,
  SYSTEM_DOCUMENT_TYPE_SCHEMA,
  TYPES
} from "../constants.js";

/** The source data of a foundry resource. */
export interface ResourceSource {
  value: number;
  max?: number;
}

/** A full resource, including a defined max. */
export interface Resource extends ResourceSource {
  max: number;
}

/** A helper class for Resources. */
export class Resource {
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
}

export const RESOURCE_JSON_SCHEMA: JSONSchemaType<ResourceSource> = {
  description: "A schema for a Foundry resource",
  type: "object",
  properties: {
    value: { type: "number", minimum: 0 },
    max: { type: "number", nullable: true }
  },
  required: ["value"],
  additionalProperties: false
};

export interface FoundrySerializable {
  /**
   * Copy and transform the DocumentData into a plain object. Draw the values of
   * the extracted object from the data source (by default) otherwise from its
   * transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values
   * @returns The extracted primitive object
   */
  toObject(source: boolean): unknown;
}

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

export function compDataZodSchema(
  dataSchema: z.Schema,
  type: SystemDocumentType,
  defaultImg: string,
  defaultName: string
): z.Schema {
  return z
    .object({
      _id: z
        .string()
        .regex(/^[a-zA-Z0-9]{16}$/)
        .default(""),
      name: z.string().default(defaultName),
      type: z.literal(type).default(type),
      data: dataSchema.default({}),
      img: z.string().min(1).default(defaultImg),
      // TODO: figure out if there should be any extra restrictions on effects and flags
      effects: z.array(z.object({}).passthrough()).default([]),
      flags: z.object({}).passthrough().default({})
    })
    .strict()
    .default({});
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
      minLength: 1,
      default: "icons/svg/item-bag.svg"
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
    img: "icons/svg/item-bag.svg",
    effects: [],
    flags: {}
  }
} as const;

import { z } from "zod";
import type { SystemDocumentType, TYPES } from "../constants.js";

/** The source data of a foundry resource. */
export type ResourceSource = z.infer<typeof RESOURCE_SCHEMA>;

export const RESOURCE_SCHEMA = z.object({
  value: z.number(),
  max: z.number().optional()
});

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
      _id: z.string().regex(/^[a-zA-Z0-9]{16}$/),
      name: z.string().default(defaultName),
      type: z.literal(type),
      data: dataSchema,
      img: z.string().min(1).default(defaultImg),
      // TODO: figure out if there should be any extra restrictions on effects and flags
      effects: z.array(z.object({}).passthrough()).default([]),
      flags: z.object({}).passthrough().default({})
    })
    .strict();
}

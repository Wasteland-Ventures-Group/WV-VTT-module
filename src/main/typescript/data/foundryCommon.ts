import { z } from "zod";
import type { SystemDocumentType } from "../constants.js";

/** The source data of a foundry resource. */
export type ResourceSource = z.infer<typeof RESOURCE_SOURCE_SCHEMA>;

export const RESOURCE_SOURCE_SCHEMA = z.object({
  value: z.number(),
  max: z.number().optional()
});

/** A full resource, including a defined max. */
export interface Resource extends ResourceSource {
  max: number;
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

/** The schema for a string that expresses a NeDB database ID */
export const ID_STRING = z.string().regex(/^[a-zA-Z0-9]{16}$/);

export function compDataZodSchema(
  dataSchema: z.Schema,
  type: SystemDocumentType,
  defaultImg: string,
  defaultName: string
): z.Schema {
  return z
    .object({
      /** The NeDB database ID of the entry */
      _id: ID_STRING.describe("The NeDB database ID of the entry"),
      /** The name of the entry in the compendium */
      name: z
        .string()
        .default(defaultName)
        .describe("The name of the entry in the compendium"),
      /** The Actor or Item type name */
      type: z.literal(type).describe("The Actor or Item type name"),
      /** The entry's system data */
      data: dataSchema.describe("The entry's system data"),
      /** The image of the entry */
      img: z
        .string()
        .min(1)
        .default(defaultImg)
        .describe("The image of the entry"),
      // TODO: figure out if there should be any extra restrictions on effects and flags
      /** Foundry Active Effects on the entry */
      effects: z
        .array(z.object({}).passthrough())
        .default([])
        .describe("Foundry Active Effects on the entry"),
      /** Custom flags on the entry */
      flags: z
        .object({})
        .passthrough()
        .default({})
        .describe("Custom flags on the entry")
    })
    .strict();
}

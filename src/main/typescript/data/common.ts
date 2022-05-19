import type { JSONSchemaType } from "ajv";

/** A class to represent modifiable numbers. */
export class ModifiableNumber {
  constructor(
    /**
     * The source value of the number This can be in the database, in which case
     * it should not be modified aside from user input.
     */
    public source: number,

    /**
     * The total value of the number, that can be safely modified and is not
     * saved in the database.
     */
    public total?: number
  ) {}
}

/**
 * Get the total of a modifiable number, falling back to the source if total is
 * undefined.
 */
export function getTotal(modNumber: {
  source: number;
  total?: number | undefined;
}): number {
  return modNumber.total ?? modNumber.source;
}

export const MODIFIABLE_NUMBER_JSON_SCHEMA: JSONSchemaType<ModifiableNumber> = {
  description: "A schema for modifiable numbers",
  type: "object",
  properties: {
    source: {
      description:
        "The source value of the number This can be in the database, in which case it should not be modified aside from user input.",
      type: "number"
    },
    total: {
      description:
        "The total value of the number, that can be safely modified and is not saved in the database.",
      type: "number",
      nullable: true
    }
  },
  required: ["source"],
  additionalProperties: false
};

import type { ZodIssue } from "zod";

/** A custom error to signal invalid system data */
export default class SystemDataSchemaError extends Error {
  /** @param errors - the AJV validation errors */
  constructor(public errors: ZodIssue[]) {
    super("The system data was not valid.");
  }
}

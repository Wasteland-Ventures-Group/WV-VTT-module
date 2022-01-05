import type { ErrorObject } from "ajv";

/** A custom error to signal invalid system data */
export default class SystemDataValidationError extends Error {
  /** @param errors - the AJV validation errors */
  constructor(public errors: ErrorObject[]) {
    super("The system data was not valid.");
  }
}

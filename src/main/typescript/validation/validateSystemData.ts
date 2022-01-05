import type { ValidateFunction } from "ajv";
import SystemDataValidationError from "../systemDataValidationError.js";
import { LOG } from "../systemLogger.js";

/**
 * Validate the given system data against the given JSON schema of it.
 * If there are errors, they are logged to the console with the system logger.
 * @throws SystemDataValidationError - If the system data is not valid
 */
export default function validateSystemData<T>(
  data: T,
  validator: ValidateFunction<T>
): void {
  if (validator(data)) return;

  for (const error of validator.errors ?? []) {
    LOG.error(error);
  }

  throw new SystemDataValidationError(validator.errors ?? []);
}

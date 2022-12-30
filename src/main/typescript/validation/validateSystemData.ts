import SystemDataSchemaError from "../systemDataSchemaError.js";
import { LOG } from "../systemLogger.js";
import type { Validator } from "../typesConfig.js";

/**
 * Validate the given system data against the given JSON schema of it.
 * If there are errors, they are logged to the console with the system logger.
 * @throws SystemDataSchemaError - If the system data is not valid
 */
export default function validateSystemData<T>(
  data: T,
  validator: Validator<T>
): void {
  const result = validator(data);
  if (result.success) return;

  for (const error of result.error.issues) {
    LOG.error(error);
  }

  throw new SystemDataSchemaError(result.error.issues);
}

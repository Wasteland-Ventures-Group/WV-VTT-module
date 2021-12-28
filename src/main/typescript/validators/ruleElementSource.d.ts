import type { ValidateFunction } from "ajv";
import type RuleElementSource from "../ruleEngine/ruleElementSource.js";

/**
 * A validation function to validate RuleElement sources. For how to use it,
 * see Ajv's `validate` function.
 */
declare const validate10: ValidateFunction<RuleElementSource>;
export default validate10;

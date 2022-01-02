import type { JTDSchemaType, ValidateFunction } from "ajv/dist/jtd";
import { getGame } from "../foundryHelpers.js";
import type { RuleElementTarget } from "./ruleElement.js";
import { RULE_ELEMENT_TARGETS } from "./ruleElement.js";
import type { MappedRuleElementId } from "./ruleElements.js";
import { RULE_ELEMENTS } from "./ruleElements.js";

/** The RuleElement raw data layout */
export default interface RuleElementSource {
  /** Whether this rule element is enabled */
  enabled: boolean;

  /** The label of the element */
  label: string;

  /** The place in the order of application, starting with lowest */
  priority: number;

  /** The selector of the element */
  selector: string;

  /**
   * Whether the RuleElement applies to the the Document or the Owning document
   */
  target: RuleElementTarget;

  /** The type identifier of the element. */
  type: MappedRuleElementId;

  /** The value of the element */
  value: number;
}

/**
 * Create a validation function to check whether a JSON object is a valid
 * RuleElementSource. The function can serve as a type guard and errors can be
 * accessed with the `errors` property.
 * @see {@link Ajv#compile}
 */
export function createValidator(): ValidateFunction<RuleElementSource> {
  const schema: JTDSchemaType<RuleElementSource> = {
    properties: {
      enabled: { type: "boolean" },
      label: { type: "string" },
      priority: { type: "int32" },
      selector: { type: "string" },
      target: { enum: RULE_ELEMENT_TARGETS as unknown as RuleElementTarget[] },
      type: { enum: Object.keys(RULE_ELEMENTS) as MappedRuleElementId[] },
      value: { type: "int32" }
    }
  };

  return getGame().wv.ajv.compile(schema);
}

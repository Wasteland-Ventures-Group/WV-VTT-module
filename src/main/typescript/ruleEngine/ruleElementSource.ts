import type { JSONSchemaType } from "ajv";
import type { RuleElementTarget } from "./ruleElement.js";
import type { MappedRuleElementId } from "./ruleElements.js";

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
  value: boolean | number | string;
}

export const schema: JSONSchemaType<RuleElementSource> = {
  type: "object",
  properties: {
    enabled: { type: "boolean" },
    label: { type: "string" },
    priority: { type: "number" },
    selector: { type: "string" },
    target: { type: "string", enum: ["actor", "item"] },
    type: {
      type: "string",
      enum: ["WV.RuleElement.FlatModifier", "WV.RuleElement.ReplaceValue"]
    },
    value: { type: ["boolean", "number", "string"] }
  },
  required: [
    "enabled",
    "label",
    "priority",
    "selector",
    "target",
    "type",
    "value"
  ],
  additionalProperties: false
};

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

/** A JSON schema for RuleElementSource objects */
export const JSON_SCHEMA: JSONSchemaType<RuleElementSource> = {
  description: "The RuleElement raw data layout",
  type: "object",
  properties: {
    enabled: {
      description: "Whether this rule element should take effect",
      type: "boolean",
      default: true
    },
    label: {
      description: "A descriptive label for the rule element",
      type: "string",
      default: ""
    },
    priority: {
      description:
        "An absolute priority, used to order rule elements affecting the " +
        "same target, lowest goes first",
      type: "number",
      default: 0
    },
    selector: {
      description:
        "A property selector to pick the property the rule element should be " +
        "applied to",
      type: "string",
      default: ""
    },
    target: {
      description:
        "Whether the rule element applies to its own item or the owning actor",
      type: "string",
      enum: ["actor", "item"],
      default: "item"
    },
    type: {
      description: "The identifier of the type or rule element to use",
      type: "string",
      enum: ["WV.RuleElement.FlatModifier", "WV.RuleElement.ReplaceValue"],
      default: "WV.RuleElement.FlatModifier"
    },
    value: {
      description: "The value to use for the rule element",
      oneOf: [{ type: "boolean" }, { type: "number" }, { type: "string" }],
      default: 0
    }
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
  additionalProperties: false,
  default: {
    enabled: true,
    label: "New Rule Element",
    priority: 100,
    selector: "",
    target: "item",
    type: "WV.RuleElement.FlatModifier",
    value: 0
  }
};

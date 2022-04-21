import type { JSONSchemaType } from "ajv";
import { RuleElementId, RULE_ELEMENTS } from "./ruleElements.js";

/** The RuleElement raw data layout */
export default interface RuleElementSource {
  /** Whether this rule element is enabled */
  enabled: boolean;

  /** Where in the data preparation chain the rule element applies */
  hook: RuleElementHook;

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
  type: RuleElementId;

  /** The value of the element */
  value: boolean | number | string;
}

export const RULE_ELEMENT_HOOKS = [
  "afterSpecial",
  "afterSkills",
  "afterComputation"
] as const;

export type RuleElementHook = typeof RULE_ELEMENT_HOOKS[number];

/** The valid values of a RuleElement target property */
export const RULE_ELEMENT_TARGETS = ["item", "actor"] as const;

/** The type of the valid values for a RuleElement target property */
export type RuleElementTarget = typeof RULE_ELEMENT_TARGETS[number];

/** A JSON schema for RuleElementSource objects */
export const RULE_ELEMENT_SOURCE_JSON_SCHEMA: JSONSchemaType<RuleElementSource> =
  {
    description: "The RuleElement raw data layout",
    type: "object",
    properties: {
      enabled: {
        description: "Whether this rule element should take effect",
        type: "boolean",
        default: true
      },
      hook: {
        description:
          "Where in the data preparation chain the rule element applies",
        type: "string",
        enum: RULE_ELEMENT_HOOKS,
        default: "afterSpecial"
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
        enum: RULE_ELEMENT_TARGETS,
        default: "item"
      },
      type: {
        description: "The identifier of the type or rule element to use",
        type: "string",
        enum: Object.keys(RULE_ELEMENTS) as RuleElementId[],
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
      "hook",
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
      hook: "afterSpecial",
      label: "New Rule Element",
      priority: 100,
      selector: "",
      target: "item",
      type: "WV.RuleElement.FlatModifier",
      value: 0
    }
  };

import type { JSONSchemaType } from "ajv";
import { z } from "zod";
import {
  DOCUMENTSELECTOR_SOURCE_SCHEMA
} from "./documentSelectorSource.js";

export type RuleElementId = typeof RULE_ELEMENT_IDS[number];
export const RULE_ELEMENT_IDS = [
  "WV.RuleElement.FlatModifier",
  "WV.RuleElement.NumberComponent",
  "WV.RuleElement.PermSpecialComponent",
  "WV.RuleElement.ReplaceValue",
  "WV.RuleElement.TempSpecialComponent"
] as const;

export type RuleElementHook = typeof RULE_ELEMENT_HOOKS[number];
export const RULE_ELEMENT_HOOKS = [
  "afterSpecial",
  "afterSkills",
  "afterComputation"
] as const;

export const RULE_ELEMENT_CONDITIONS = ["whenEquipped"] as const;

/** The RuleElement raw data layout */
export default interface RuleElementSource extends z.infer<typeof RULE_ELEMENT_SOURCE_SCHEMA> {};
export const RULE_ELEMENT_SOURCE_SCHEMA = z.object({
  /** Whether this rule element is enabled */
  enabled: z.boolean(),
  /** Where in the data preparation chain the rule element applies */
  hook: z.enum(RULE_ELEMENT_HOOKS),
  /**
   * Optional conditions when this RuleElement should apply. All of the
   * conditions need to be met for the RuleElement to apply.
   */
  conditions: z.array(z.enum(RULE_ELEMENT_CONDITIONS)),
  /** The label of the element */
  label: z.string(),
  /** The place in the order of application, starting with lowest */
  priority: z.number(),
  selectors: z.array(DOCUMENTSELECTOR_SOURCE_SCHEMA),
  /** The target property on the selected document */
  target: z.string(),
  /** The type identifier of the element. */
  type: z.enum(RULE_ELEMENT_IDS),
  /** The value of the element */
  value: z.union([z.boolean(), z.number(), z.string()])
});

export type RuleElementCondition = typeof RULE_ELEMENT_CONDITIONS[number];

/** A JSON schema for RuleElementSource objects */
/*
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
      selectors: {
        description: "The filter to determine applicable documents with",
        type: "array",
        items: DOCUMENT_SELECTOR_SOURCE_JSON_SCHEMA,
        default: ["this"]
      },
      conditions: {
        description:
          "Optional conditions when this RuleElement should apply. All of the conditions need to be met for the RuleElement to apply.",
        type: "array",
        items: {
          type: "string",
          enum: RULE_ELEMENT_CONDITIONS
        },
        default: []
      },
      target: {
        description: "The target property on the selected document",
        type: "string",
        default: ""
      },
      type: {
        description: "The identifier of the type or rule element to use",
        type: "string",
        enum: RULE_ELEMENT_IDS,
        default: "WV.RuleElement.NumberComponent"
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
      "selectors",
      "conditions",
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
      selectors: ["item", "this"],
      conditions: [],
      target: "",
      type: "WV.RuleElement.NumberComponent",
      value: 0
    }
  };
  */

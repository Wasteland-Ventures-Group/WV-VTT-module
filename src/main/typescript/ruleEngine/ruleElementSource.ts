import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { DOCUMENTSELECTOR_SOURCE_SCHEMA } from "./documentSelectorSource.js";

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
export type RuleElementSource = z.infer<typeof RULE_ELEMENT_SCHEMA>;
export const RULE_ELEMENT_SCHEMA = z.object({
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
export const RULE_ELEMENT_JSON_SCHEMA = zodToJsonSchema(RULE_ELEMENT_SCHEMA);

import FlatModifier from "./ruleElements/flatModifier.js";
import ReplaceValue from "./ruleElements/replaceValue.js";

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  ["WV.RuleElement.FlatModifier"]: FlatModifier,
  ["WV.RuleElement.ReplaceValue"]: ReplaceValue
} as const;

export type RuleElementId = keyof typeof RULE_ELEMENTS;

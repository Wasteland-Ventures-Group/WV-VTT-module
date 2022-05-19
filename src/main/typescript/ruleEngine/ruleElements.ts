import FlatModifier from "./ruleElements/flatModifier.js";
import ModifiableNumberModifier from "./ruleElements/modifiableNumberModifier.js";
import ReplaceValue from "./ruleElements/replaceValue.js";

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  ["WV.RuleElement.FlatModifier"]: FlatModifier,
  ["WV.RuleElement.ModifiableNumberModifier"]: ModifiableNumberModifier,
  ["WV.RuleElement.ReplaceValue"]: ReplaceValue
} as const;

export type RuleElementId = keyof typeof RULE_ELEMENTS;

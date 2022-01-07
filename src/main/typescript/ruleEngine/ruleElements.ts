import FlatModifier from "./ruleElements/flatModifier.js";
import ReplaceValue from "./ruleElements/replaceValue.js";

/** RuleElement identifier strings */
export const RULE_ELEMENT_IDS = {
  FLAT_MODIFIER: "WV.RuleElement.FlatModifier",
  REPLACE_VALUE: "WV.RuleElement.ReplaceValue"
} as const;

/** A union type of RuleElement ID strings */
export type RuleElementId = ValueOf<typeof RULE_ELEMENT_IDS>;

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  [RULE_ELEMENT_IDS.FLAT_MODIFIER]: FlatModifier,
  [RULE_ELEMENT_IDS.REPLACE_VALUE]: ReplaceValue
} as const;

export type MappedRuleElementId = keyof typeof RULE_ELEMENTS;

/**
 * A custom typeguard to check whether a given RuleElement type string is one of
 * the mapped RuleElement types.
 * @param type - the type string to check
 * @returns whether the type string is one of the RuleElement types
 */
export function isMappedRuleElementType(
  type?: string
): type is MappedRuleElementId {
  if (typeof type !== "string") return false;
  return Object.keys(RULE_ELEMENTS).includes(type);
}

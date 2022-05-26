import FlatModifier from "./ruleElements/flatModifier.js";
import NumberComponent from "./ruleElements/numberComponent.js";
import PermSpecialComponent from "./ruleElements/permSpecialComponent.js";
import ReplaceValue from "./ruleElements/replaceValue.js";
import TempSpecialComponent from "./ruleElements/tempSpecialComponent.js";

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  ["WV.RuleElement.FlatModifier"]: FlatModifier,
  ["WV.RuleElement.NumberComponent"]: NumberComponent,
  ["WV.RuleElement.PermSpecialComponent"]: PermSpecialComponent,
  ["WV.RuleElement.ReplaceValue"]: ReplaceValue,
  ["WV.RuleElement.TempSpecialComponent"]: TempSpecialComponent
} as const;

export type RuleElementId = keyof typeof RULE_ELEMENTS;

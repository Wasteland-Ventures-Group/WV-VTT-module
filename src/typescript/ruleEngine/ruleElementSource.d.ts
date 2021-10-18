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
  /** The type identifier of the element */
  type: string;
  /** The value of the element */
  value: number;
}

/** Allowed type identifiers of RuleElements */
export type RuleElementType = "WV.RuleElement.FlatModifier" | "NewRuleElement";

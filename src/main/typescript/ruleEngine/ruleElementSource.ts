import {
  type DocumentSelectorSource,
} from "./documentSelectorSource.js";
import fields = foundry.data.fields;


/** The RuleElement raw data layout */
interface RuleElementSourceOld {
  /** Whether this rule element is enabled */
  enabled: boolean;

  /** Where in the data preparation chain the rule element applies */
  hook: RuleElementHook;

  /** The label of the element */
  label: string;

  /** The place in the order of application, starting with lowest */
  priority: number;

  /** The filter to determine applicable documents with */
  selectors: DocumentSelectorSource[];

  /**
   * Optional conditions when this RuleElement should apply. All of the
   * conditions need to be met for the RuleElement to apply.
   */
  conditions: RuleElementCondition[];

  /** The target property on the selected document */
  target: string;

  /** The type identifier of the element. */
  type: RuleElementId;

  /** The value of the element */
  value: boolean | number | string;
}

export type RuleElementHook = (typeof RULE_ELEMENT_HOOKS)[number];
export const RULE_ELEMENT_HOOKS = [
  "afterSpecial",
  "afterSkills",
  "afterComputation"
] as const;



export type RuleElementId = (typeof RULE_ELEMENT_IDS)[number];
export const RULE_ELEMENT_IDS = [
  "WV.RuleElement.FlatModifier",
  "WV.RuleElement.NumberComponent",
  "WV.RuleElement.PermSpecialComponent",
  "WV.RuleElement.ReplaceValue",
  "WV.RuleElement.TempSpecialComponent"
] as const;

export const RULE_ELEMENT_SCHEMA = {
  /** Whether this rule element is enabled */
  enabled: new fields.BooleanField(),
  /** Where in the data preparation chain the rule element applies */
  hook: new fields.StringField({ choices: RULE_ELEMENT_HOOKS, initial: "afterSpecial" }),
  /** The label of the element */
  label: new fields.StringField({ required: true }),
  /** The place in the order of application, starting with lowest */
  priority: new fields.NumberField(),
  /** The type identifier of the element. */
  type: new fields.StringField({ choices: RULE_ELEMENT_IDS, required: true }),
}

const RULE_ELEMENT_FIELD = new fields.SchemaField(RULE_ELEMENT_SCHEMA);

export type RuleElementSource = fields.SchemaField.InitializedData<typeof RULE_ELEMENT_SCHEMA>;
export function defaultRuleElement(): RuleElementSource {
  return RULE_ELEMENT_FIELD.getInitialValue()
}

export function validateRuleElement(value: any): void | foundry.data.validation.DataModelValidationFailure {
  return RULE_ELEMENT_FIELD.validate(value)
}

export type RuleElementCondition = (typeof RULE_ELEMENT_CONDITIONS)[number];
export const RULE_ELEMENT_CONDITIONS = ["whenEquipped"] as const;

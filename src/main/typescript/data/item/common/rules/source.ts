import { RULE_ELEMENT_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";
import fields = foundry.data.fields;

export const RULES_SCHEMA = {
  /** The source objects for the RuleElements */
  sources: new fields.ArrayField(new fields.SchemaField(RULE_ELEMENT_SCHEMA)),
}

export type RulesSource = fields.SchemaField.InitializedData<typeof RULES_SCHEMA>;


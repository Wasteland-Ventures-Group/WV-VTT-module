import type RuleElementSource from "../../../../ruleEngine/ruleElementSource.js";
import { RULE_ELEMENT_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";
import fields = foundry.data.fields;

export default class RulesSource {
  /** The source objects for the RuleElements */
  sources: RuleElementSource[] = [];
}

export const RULES_SCHEMA = {
  /** The source objects for the RuleElements */
  sources: new fields.ArrayField(new fields.SchemaField(RULE_ELEMENT_SCHEMA)),
}


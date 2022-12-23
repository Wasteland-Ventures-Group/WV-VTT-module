import { z } from "zod";
import { RULE_ELEMENT_SOURCE_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";


export default interface RulesSource extends z.infer<typeof RULES_SOURCE_SCHEMA> {}
export const RULES_SOURCE_SCHEMA = z.object({
  /** The source objects for the RuleElements */
  sources: z.array(RULE_ELEMENT_SOURCE_SCHEMA).default([])
});
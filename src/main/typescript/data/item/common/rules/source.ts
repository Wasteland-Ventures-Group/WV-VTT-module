import { z } from "zod";
import { RULE_ELEMENT_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";

export type RulesSource = z.infer<typeof RULES_SCHEMA>;
export const RULES_SCHEMA = z.object({
  /** The source objects for the RuleElements */
  sources: z.array(RULE_ELEMENT_SCHEMA).default([])
});

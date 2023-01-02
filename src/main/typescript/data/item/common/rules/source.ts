import { z } from "zod";
import { RULE_ELEMENT_SCHEMA } from "../../../../ruleEngine/ruleElementSource.js";
import { zObject } from "../../../common.js";

export type RulesSource = z.infer<typeof RULES_SCHEMA>;
export const RULES_SCHEMA = zObject({
  /** The source objects for the RuleElements */
  sources: z.array(RULE_ELEMENT_SCHEMA).default([])
});

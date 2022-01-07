import type RuleElement from "../../../ruleEngine/ruleElement.js";
import { DbRules } from "./source.js";

/** A RuleElements container, that can be used in different Items. */
export class Rules extends DbRules {
  /** The RuleElements, created from the sources */
  elements: RuleElement[] = [];
}

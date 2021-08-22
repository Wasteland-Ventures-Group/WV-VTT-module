import { getGame } from "../foundryHelpers.js";
import type WvItem from "../item/wvItem.js";
import type {
  RuleElementSource,
  TypedRuleElementSource,
  UnknownRuleElementSource
} from "./ruleElement.js";
import RuleElement from "./ruleElement.js";
import FlatModifier from "./ruleElements/flatModifier.js";
import NewRuleElement from "./ruleElements/newRuleElement.js";
import type RuleElementWarning from "./ruleElementWarning.js";
import WrongTypeWarning from "./warnings/wrongTypeWarning.js";

/** RuleElement identifier strings */
export const RULE_ELEMENT_IDS = {
  FLAT_MODIFIER: "WV.RuleElement.FlatModifier",
  NEW_RULE_ELEMENT: "NewRuleElement"
} as const;

/** A union type of RuleElement ID strings */
export type RuleElementIds = ValueOf<typeof RULE_ELEMENT_IDS>;

/** A mapping of RuleElement types to RuleElement constructors. */
export const RULE_ELEMENTS = {
  [RULE_ELEMENT_IDS.FLAT_MODIFIER]: FlatModifier,
  [RULE_ELEMENT_IDS.NEW_RULE_ELEMENT]: NewRuleElement
} as const;

export type MappedRuleElementIds = keyof typeof RULE_ELEMENTS;

/**
 * A factory class for RuleElements.
 */
export default class RuleElements {
  /**
   * Create a new RuleElementSource, suitable for when the user just added a
   * new effect and has not filled out the data yet.
   */
  static newRuleElementSource(): TypedRuleElementSource {
    return {
      enabled: true,
      label: getGame().i18n.localize("wv.ruleEngine.ruleElement.newName"),
      priority: 100,
      selector: "",
      type: RULE_ELEMENT_IDS.NEW_RULE_ELEMENT,
      value: 0
    };
  }

  /**
   * Create a new RuleElement from an UnknownRuleElementSource. If invalid
   * entries are encountered in the source, they are either replaced, if they
   * are the wrong data type, or left as is and errors added to the RuleElement.
   * @param data - the unknown data source
   * @param item - the item owning the effect
   * @returns a RuleElement with some source properties replaced if needed
   */
  static fromOwningItem(
    data: UnknownRuleElementSource,
    item: WvItem
  ): RuleElement {
    const newSource = this.newRuleElementSource();
    const warnings: RuleElementWarning[] = [];
    const errorKeys: string[] = [];

    let constructor: ConstructorOf<RuleElement>;
    let type: string;
    if (typeof data.type === "string") {
      if (isMappedRuleElementType(data.type)) {
        constructor = RULE_ELEMENTS[data.type];
      } else {
        constructor = RuleElement;
        errorKeys.push("wv.ruleEngine.errors.semantic.type.notFound");
      }
      type = data.type;
    } else {
      constructor = RULE_ELEMENTS[newSource.type];
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.type.wrongType",
          newSource.type
        )
      );
      type = newSource.type;
    }

    let enabled: boolean;
    if (typeof data.enabled === "boolean") enabled = data.enabled;
    else {
      enabled = newSource.enabled;
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.enabled.wrongType",
          enabled
        )
      );
    }

    let label: string;
    if (typeof data.label === "string") label = data.label;
    else {
      label = newSource.label;
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.label.wrongType",
          label
        )
      );
    }

    let priority: number;
    if (typeof data.priority === "number") priority = data.priority;
    else {
      priority = newSource.priority;
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.priority.wrongType",
          priority
        )
      );
    }

    let selector: string;
    if (typeof data.selector === "string") selector = data.selector;
    else {
      selector = newSource.selector;
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.selector.wrongType",
          selector
        )
      );
    }

    let value: number;
    if (typeof data.value === "number") value = data.value;
    else {
      value = newSource.value;
      warnings.push(
        new WrongTypeWarning(
          "wv.ruleEngine.errors.semantic.value.wrongType",
          value
        )
      );
    }

    const source: RuleElementSource = {
      enabled: enabled,
      label: label,
      priority: priority,
      selector: selector,
      type: type,
      value: value
    };

    return new constructor(source, item, warnings, errorKeys);
  }
}

/**
 * A custom typeguard to check whether a given RuleElement type string is one of
 * the mapped RuleElement types.
 * @param type - the type string to check
 * @returns whether the type string is one of the RuleElement types
 */
export function isMappedRuleElementType(
  type?: string
): type is MappedRuleElementIds {
  if (typeof type !== "string") return false;
  return Object.keys(RULE_ELEMENTS).includes(type);
}

import { getGame } from "../foundryHelpers.js";
import type WvItem from "../item/wvItem.js";
import type {
  RuleElementLike,
  TypedRuleElementSource,
  UnknownRuleElementSource
} from "./ruleElement.js";
import FlatModifier from "./ruleElements/flatModifier.js";
import RuleElementMessage from "./ruleElementMessage.js";
import MissingPropMessage from "./messages/missingPropMessage.js";
import WrongTypeMessage from "./messages/wrongTypeMessage.js";
import validate from "../validators/ruleElementSource.js";
import type { ErrorObject } from "ajv";

/** RuleElement identifier strings */
export const RULE_ELEMENT_IDS = {
  FLAT_MODIFIER: "WV.RuleElement.FlatModifier"
} as const;

/** A union type of RuleElement ID strings */
export type RuleElementId = ValueOf<typeof RULE_ELEMENT_IDS>;

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  [RULE_ELEMENT_IDS.FLAT_MODIFIER]: FlatModifier
} as const;

export type MappedRuleElementId = keyof typeof RULE_ELEMENTS;

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
      type: RULE_ELEMENT_IDS.FLAT_MODIFIER,
      value: 0
    };
  }

  /**
   * Create a new RuleElement from an UnknownRuleElementSource. If invalid
   * entries are encountered in the source, they are either replaced, if they
   * are the wrong data type, or left as is and errors added to the RuleElement.
   * @param source - the unknown data source
   * @param item - the item owning the effect
   * @returns a RuleElement with some source properties replaced if needed
   */
  static fromOwningItem(
    source: UnknownRuleElementSource,
    item: WvItem
  ): RuleElementLike {
    const messages: RuleElementMessage[] = [];

    if (validate(source)) {
      if (isMappedRuleElementType(source.type)) {
        return new RULE_ELEMENTS[source.type](source, item);
      } else {
        messages.push(
          new RuleElementMessage(
            "wv.ruleEngine.errors.semantic.unknownRuleElement",
            "error"
          )
        );
      }
    } else {
      validate.errors?.forEach((error) =>
        messages.push(this.translateError(error))
      );
    }

    return { item, messages, source };
  }

  protected static translateError(error: ErrorObject): RuleElementMessage {
    switch (error.keyword) {
      case "required":
        return new MissingPropMessage(
          error.instancePath,
          error.params.missingProperty
        );
      case "type":
        return new WrongTypeMessage(error.instancePath, error.params.type);
      default:
        return new RuleElementMessage("wv.ruleEngine.errors.semantic.unknown");
    }
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
): type is MappedRuleElementId {
  if (typeof type !== "string") return false;
  return Object.keys(RULE_ELEMENTS).includes(type);
}

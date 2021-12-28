import { getGame } from "../foundryHelpers.js";
import type WvItem from "../item/wvItem.js";
import type {
  RuleElementLike,
  KnownRuleElementSource,
  UnknownRuleElementSource,
  RuleElementTarget
} from "./ruleElement.js";
import FlatModifier from "./ruleElements/flatModifier.js";
import RuleElementMessage from "./ruleElementMessage.js";
import MissingPropMessage from "./messages/missingPropMessage.js";
import WrongTypeMessage from "./messages/wrongTypeMessage.js";
import validate from "../validators/ruleElementSource.js";
import type { ErrorObject } from "ajv";
import { isValidTarget } from "./ruleElement.js";

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
  static newRuleElementSource(): KnownRuleElementSource {
    return {
      enabled: true,
      label: getGame().i18n.localize("wv.ruleEngine.ruleElement.newName"),
      priority: 100,
      selector: "",
      target: "item",
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

    // Check the passed JSON source against the schema. When it is invalid, only
    // return a RuleElementLike.
    if (!validate(source)) {
      validate.errors?.forEach((error) =>
        messages.push(this.translateError(error))
      );

      return { item, messages, source };
    }

    // Check if the target of the RuleElementSource is valid. If not, return a
    // RuleElementLike.
    let target: RuleElementTarget;
    if (!isValidTarget(source.target)) {
      messages.push(
        new RuleElementMessage(
          "wv.ruleEngine.errors.semantic.unknownTarget",
          "error"
        )
      );

      return { item, messages, source };
    } else {
      target = source.target;
    }

    // Check if the type of RuleElement is known. If not, return a
    // RuleElementLike.
    let type: MappedRuleElementId;
    if (!isMappedRuleElementType(source.type)) {
      messages.push(
        new RuleElementMessage(
          "wv.ruleEngine.errors.semantic.unknownRuleElement",
          "error"
        )
      );

      return { item, messages, source };
    } else {
      type = source.type;
    }

    return new RULE_ELEMENTS[type]({ ...source, target, type }, item, messages);
  }

  /** Translate an AJV ErrorObject to a RuleElementMessage. */
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

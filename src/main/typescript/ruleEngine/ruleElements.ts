import type { DefinedError, ValidateFunction } from "ajv";
import { getGame } from "../foundryHelpers.js";
import type WvItem from "../item/wvItem.js";
import AdditionalPropMessage from "./messages/additionalPropMessage.js";
import MissingPropMessage from "./messages/missingPropMessage.js";
import WrongTypeMessage from "./messages/wrongTypeMessage.js";
import type {
  KnownRuleElementSource,
  RuleElementLike,
  UnknownRuleElementSource
} from "./ruleElement.js";
import RuleElementMessage from "./ruleElementMessage.js";
import FlatModifier from "./ruleElements/flatModifier.js";
import ReplaceValue from "./ruleElements/replaceValue.js";
import type RuleElementSource from "./ruleElementSource.js";
import { schema } from "./ruleElementSource.js";

/** RuleElement identifier strings */
export const RULE_ELEMENT_IDS = {
  FLAT_MODIFIER: "WV.RuleElement.FlatModifier",
  REPLACE_VALUE: "WV.RuleElement.ReplaceValue"
} as const;

/** A union type of RuleElement ID strings */
export type RuleElementId = ValueOf<typeof RULE_ELEMENT_IDS>;

/** A mapping of RuleElement IDs to RuleElement constructors. */
export const RULE_ELEMENTS = {
  [RULE_ELEMENT_IDS.FLAT_MODIFIER]: FlatModifier,
  [RULE_ELEMENT_IDS.REPLACE_VALUE]: ReplaceValue
} as const;

export type MappedRuleElementId = keyof typeof RULE_ELEMENTS;

/**
 * A factory class for RuleElements.
 */
export default class RuleElements {
  /** A cached validator function for rule element sources. */
  protected static isValidRuleElementSource: ValidateFunction<RuleElementSource> | null =
    null;

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

    const validate = RuleElements.validate;

    // Check the passed JSON source against the schema. When it is invalid, only
    // return a RuleElementLike.
    if (!validate(source)) {
      for (const error of validate.errors as DefinedError[]) {
        messages.push(this.translateError(error));
      }

      return { item, messages, source };
    }

    const target = source.target;
    const type = source.type;
    return new RULE_ELEMENTS[type]({ ...source, target, type }, item, messages);
  }

  /** Translate an AJV DefinedError to a RuleElementMessage. */
  protected static translateError(error: DefinedError): RuleElementMessage {
    console.dir(error);
    switch (error.keyword) {
      case "additionalProperties":
        return new AdditionalPropMessage(
          error.instancePath,
          error.params.additionalProperty
        );
      case "required":
        return new MissingPropMessage(
          error.instancePath,
          error.params.missingProperty
        );

      case "type":
        return new WrongTypeMessage(error.instancePath, error.params.type);

      case "enum":
        switch (error.schemaPath) {
          case "#/properties/target/enum":
            return new RuleElementMessage(
              "wv.ruleEngine.errors.semantic.unknownTarget",
              "error"
            );
          case "#/properties/type/enum":
            return new RuleElementMessage(
              "wv.ruleEngine.errors.semantic.unknownRuleElement",
              "error"
            );
        }
    }

    console.dir(error);
    return new RuleElementMessage("wv.ruleEngine.errors.semantic.unknown");
  }

  /** Get a possibly cached validation function. */
  protected static get validate(): ValidateFunction<RuleElementSource> {
    if (RuleElements.isValidRuleElementSource)
      return RuleElements.isValidRuleElementSource;

    return (RuleElements.isValidRuleElementSource =
      getGame().wv.ajv.compile(schema));
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

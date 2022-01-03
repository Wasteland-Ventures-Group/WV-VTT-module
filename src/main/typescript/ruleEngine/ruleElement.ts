import type WvItem from "../item/wvItem.js";
import type { RuleElementId } from "./ruleElements.js";
import type RuleElementSource from "./ruleElementSource.js";
import RuleElementMessage from "./ruleElementMessage.js";
import WrongSelectedTypeMessage from "./messages/wrongSelectedTypeMessage.js";

/**
 * A rule engine element, allowing the modification of a data point, specified
 * by a selector and a given value. How the data point is modified depends on
 * the type of the element.
 */
export default abstract class RuleElement implements RuleElementLike {
  /**
   * Create a RuleElement from the given data and owning item.
   * @param source   - the source data for the RuleElement
   * @param item     - the owning item
   * @param messages - potential messages encountered when validating the source
   *                   before creating the RuleElement
   */
  constructor(
    source: KnownRuleElementSource,
    public item: WvItem,
    messages: RuleElementMessage[] = []
  ) {
    this.messages = messages;
    this.source = source;

    this.validate();
  }

  /** Messages that were accumulated while validating the source */
  messages: RuleElementMessage[];

  /** The data of the RuleElement */
  source: KnownRuleElementSource;

  /** Get the priority number of the RuleElement. */
  get priority(): number {
    return this.source.priority;
  }

  /** Get the property selector of the RuleElement. */
  get selector(): string {
    return this.source.selector;
  }

  /** Get the target property of the RuleElement. */
  get target(): RuleElementTarget {
    return this.source.target;
  }

  /**
   * Get the target Document of the RuleElement.
   * @throws if the target is "actor" and the RuleElement's Item has no Actor.
   */
  get targetDoc(): Actor | Item {
    switch (this.target) {
      case "item":
        return this.item;
      case "actor":
        if (this.item.actor === null) {
          throw new Error("The actor of the RuleElement's item is null!");
        }

        return this.item.actor;
    }
  }

  /** Get the value of the RuleElement. */
  get value(): number {
    return this.source.value;
  }

  /** Whether the RuleElement has errors */
  hasErrors(): boolean {
    return hasErrors(this);
  }

  /** Whether the RuleElement has warnings */
  hasWarnings(): boolean {
    return hasWarnings(this);
  }

  /** Whether something prevents this rule element from modifying the owner. */
  shouldNotModify(): boolean {
    return this.hasErrors() || !this.source.enabled;
  }

  /**
   * Modify the passed Document on the prepareEmbeddedDocuments step, if the
   * RuleElement does not have errors.
   * @param doc - the Document to modify
   */
  onPrepareEmbeddedDocuments(): void {
    if (this.shouldNotModify()) return;

    this._onPrepareEmbeddedDocuments();
  }

  /** Validate the data and add any error messages to errors. */
  protected validate(): void {
    if (this.target === "actor" && this.item.actor === null) {
      this.messages.push(
        new RuleElementMessage("wv.ruleEngine.errors.logical.noActor", "error")
      );

      return;
    }
  }

  /**
   * Modify the passed Document on the prepareEmbeddedDocuments step.
   *
   * This is only called when the RuleElement has no errors and should be
   * overridden by subclasses.
   * @param doc - the Document to modify
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPrepareEmbeddedDocuments(): void {
    // NOOP
  }

  /**
   * Check whether the selected property is of the given type.
   *
   * If the type is incorrect, an error message is added to the RuleElement.
   * @param expectedType - the type to check for
   * @returns whether the type is correct
   * @throws if anything else than a TypeError is thrown by
   *         `foundry.utils.getProperty()`
   */
  protected checkSelectedIsOfType(expectedType: string) {
    let wrongType = false;

    try {
      const actualType = typeof foundry.utils.getProperty(
        this.targetDoc.data.data,
        this.selector
      );
      if (actualType !== expectedType) {
        wrongType = true;
      }
    } catch (error) {
      if (error instanceof TypeError) {
        // This can happen, when the prefix part of a path finds a valid
        // property, which has a non-object value and the selector has further
        // parts.
        wrongType = true;
      } else {
        throw error;
      }
    }

    if (wrongType) {
      // This has to be accessed in this way, because `checkSelectedIsOfType()`
      // can end up being called when the `data` on an Actor or Item is not
      // initialized yet.
      const targetName = this.targetDoc.data?.name ?? null;

      this.messages.push(
        new WrongSelectedTypeMessage(targetName, this.selector, expectedType)
      );
    }

    return !wrongType;
  }
}

/** Check whether the given RuleElementLike has errors */
export function hasErrors(element: RuleElementLike): boolean {
  return element.messages.some((message) => message.isError());
}

/** Check whether the given RuleElementLike has warnings */
export function hasWarnings(element: RuleElementLike): boolean {
  return element.messages.some((message) => message.isWarning());
}

/**
 * A version of the RuleElement raw data layout, where the more complex types of
 * each member are known to be correct.
 */
export interface KnownRuleElementSource extends RuleElementSource {
  target: RuleElementTarget;
  type: RuleElementId;
}

/** The valid values of a RuleElement target property */
export const RULE_ELEMENT_TARGETS = ["item", "actor"] as const;

/** The type of the valid values for a RuleElement target property */
export type RuleElementTarget = typeof RULE_ELEMENT_TARGETS[number];

/**
 * A custom typeguard to check whether a given RuleElement target string has a
 * valid value.
 * @param target - the target string to check
 * @returns whether the target string is valid
 */
export function isValidTarget(target?: string): target is RuleElementTarget {
  return RULE_ELEMENT_TARGETS.includes(target as RuleElementTarget);
}

/**
 * An unknown version of the RuleElement raw data layout, where each key might
 * not exist and is of an unknown type.
 */
export type UnknownRuleElementSource = {
  [K in keyof RuleElementSource]?: unknown;
};

/**
 * An interface that can be used to pass data around, when no RuleElement could
 * be created.
 */
export interface RuleElementLike {
  item: WvItem;
  messages: RuleElementMessage[];
  source: UnknownRuleElementSource;
}
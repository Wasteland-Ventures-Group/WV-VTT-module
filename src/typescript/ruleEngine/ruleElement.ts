import type WvItem from "../item/wvItem.js";
import type { RuleElementId } from "./ruleElements.js";
import type RuleElementSource from "./ruleElementSource.js";
import type RuleElementMessage from "./ruleElementMessage.js";

/**
 * A rule engine element, allowing the modification of a data point, specified
 * by a selector and a given value. How the data point is modified depends on
 * the type of the element.
 */
export default class RuleElement implements RuleElementLike {
  /**
   * Create a RuleElement from the given data and owning item.
   * @param source   - the source data for the RuleElement
   * @param item     - the owning item
   * @param messages - potential messages encountered when validating the source
   *                   before creating the RuleElement
   */
  constructor(
    source: RuleElementSource,
    public item: WvItem,
    messages: RuleElementMessage[] = []
  ) {
    this.messages = messages;
    this.source = source;

    this.validateSource();
  }

  /** Messages that were accumulated while validating the source */
  messages: RuleElementMessage[];

  /** The data of the RuleElement */
  source: RuleElementSource;

  /** Get the priority number of the RuleElement. */
  get priority(): number {
    return this.source.priority;
  }

  /** Get the property selector of the RuleElement. */
  get selector(): string {
    return this.source.selector;
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
   * Modify the passed Document on the prepareEmbeddedEntities step, if the
   * RuleElement does not have errors.
   * @param doc - the Document to modify
   */
  onPrepareEmbeddedEntities(doc: Actor | Item): void {
    if (this.shouldNotModify()) return;

    this._onPrepareEmbeddedEntities(doc);
  }

  /** Validate the input source and add any error messages to errors. */
  protected validateSource(): void {
    // NOOP
  }

  /**
   * Modify the passed Document on the prepareEmbeddedEntities step.
   *
   * This is only called when the RuleElement has no errors and should be
   * overridden by subclasses.
   * @param doc - the Document to modify
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPrepareEmbeddedEntities(_doc: Actor | Item): void {
    // NOOP
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
 * A version of the RuleElement raw data layout, where the type is definitely a
 * known ID.
 */
export type TypedRuleElementSource = RuleElementSource & {
  type: RuleElementId;
};

/**
 * An unknown version of the RuleElement raw data layout, where each key might
 * not exist and is of an unknown type.
 */
export type UnknownRuleElementSource = {
  [K in keyof RuleElementSource]?: unknown;
};

export interface RuleElementLike {
  item: WvItem;
  messages: RuleElementMessage[];
  source: UnknownRuleElementSource;
}

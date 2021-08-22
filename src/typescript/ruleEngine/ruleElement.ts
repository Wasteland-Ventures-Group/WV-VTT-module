import type WvItem from "../item/wvItem.js";
import type { RuleElementIds } from "./ruleElements.js";
import type RuleElementWarning from "./ruleElementWarning.js";

/**
 * A rule engine element, allowing the modification of a data point, specified
 * by a selector and a given value. How the data point is modified depends on
 * the type of the element.
 */
export default class RuleElement {
  /**
   * Create a RuleElement from the given data and owning item.
   * @param source      - the source data for the RuleElement
   * @param item        - the owning item
   * @param warnings    - potential warnings encountered when validating the
   *                      source before creating the RuleElement
   * @param errorKeys   - i18n keys of potential errors encountered when
   *                      validating the source before creating the RuleElement
   */
  constructor(
    source: RuleElementSource,
    public item: WvItem,
    warnings: RuleElementWarning[] = [],
    errorKeys: string[] = []
  ) {
    this.warnings = warnings;
    this.errorKeys = errorKeys;
    this.source = source;

    this.validateSource();
  }

  /** Messages keys for warnings that were encountered in the source */
  warnings: RuleElementWarning[];

  /** Messages keys for errors that were encountered in the source */
  errorKeys: string[];

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
    return this.errorKeys.length > 0;
  }

  /** Whether the RuleElement has warnings */
  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  /** Whether the RuleElement is new */
  isNew(): boolean {
    return false;
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
  protected _onPrepareEmbeddedEntities(doc: Actor | Item): void {
    // NOOP
  }
}

/** The RuleElement raw data layout */
export type RuleElementSource = {
  /** Whether this rule element is enabled */
  enabled: boolean;
  /** The label of the element */
  label: string;
  /** The place in the order of application, starting with lowest */
  priority: number;
  /** The selector of the element */
  selector: string;
  /** The type identifier of the element */
  type: string;
  /** The value of the element */
  value: number;
};

/**
 * A version of the RuleElement raw data layout, where the type is definitely a
 * known ID.
 */
export type TypedRuleElementSource = RuleElementSource & {
  type: RuleElementIds;
};

/**
 * An unknown version of the RuleElement raw data layout, where each key might
 * not exist and is of an unknown type.
 */
export type UnknownRuleElementSource = {
  [K in keyof RuleElementSource]?: unknown;
};

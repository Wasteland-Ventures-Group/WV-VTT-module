import WvActor from "../actor/wvActor.js";
import type { LabelComponent } from "../data/common.js";
import {
  isOwningActor,
  isSameDocument,
  isSiblingItem
} from "../foundryHelpers.js";
import type { DocumentRelation } from "../item/wvItem.js";
import WvItem from "../item/wvItem.js";
import { LOG } from "../systemLogger.js";
import DocumentSelector, { createSelector } from "./documentSelector.js";
import ChangedTypeMessage from "./messages/changedTypeMessage.js";
import NotMatchingTargetMessage from "./messages/notMatchingTargetMessage.js";
import WrongTargetTypeMessage from "./messages/wrongTargetTypeMessage.js";
import WrongValueTypeMessage from "./messages/wrongValueTypeMessage.js";
import type RuleElementMessage from "./ruleElementMessage.js";
import type RuleElementSource from "./ruleElementSource.js";
import type {
  RuleElementCondition,
  RuleElementHook
} from "./ruleElementSource.js";

/**
 * A rule engine element, allowing the modification of a data point, specified
 * by a target and a given value. How the data point is modified depends on the
 * type of the element.
 */
export default class RuleElement {
  /**
   * Create a RuleElement from the given data and owning item.
   * @param source   - the source data for the RuleElement
   * @param item     - the owning item
   */
  constructor(
    /** The source data of the RuleElement */
    public source: RuleElementSource,

    /** The owning Item of the RuleElement */
    public item: WvItem
  ) {
    this.validate();
    this.selectors = this.source.selectors.map((source) =>
      createSelector(this.item, source)
    );
  }

  /** Messages that were accumulated while validating the source. */
  messages: RuleElementMessage[] = [];

  /**
   * Document IDs mapping to arrays of messages, specific to the respective
   * Document.
   */
  documentMessages: Record<string, DocumentMessagesValue> = {};

  /**
   * Whether there was at least one considered ephemeral document that had
   * errors.
   */
  hasEphemeralDocumentErrors = false;

  /** Get the filtering selectors of the RuleElement. */
  selectors: DocumentSelector[];

  /** Selected document IDs, mapping to their names */
  selectedDocuments: Record<
    string,
    { name: string; relation: DocumentRelation }
  > = {};

  /** Get the conditions for this RuleElement. */
  get conditions(): RuleElementCondition[] {
    return this.source.conditions;
  }

  /** Get the enabled setting of the RuleElement. */
  get enabled(): boolean {
    return this.source.enabled;
  }

  get hook(): RuleElementHook {
    return this.source.hook;
  }

  /** Get the label of the RuleElement. */
  get label(): string {
    return this.source.label;
  }

  /**
   * Get the full label of this RuleElement as LabelComponents of the item name
   * and RuleElement label.
   */
  get labelComponents(): LabelComponent[] {
    const components: LabelComponent[] = [];

    if (this.item.name) {
      components.push({ text: this.item.name });
      components.push({ text: "-" });
    }
    components.push({ text: this.label });

    return components;
  }

  /** Get the priority number of the RuleElement. */
  get priority(): number {
    return this.source.priority;
  }

  /** Get the target property of the RuleElement. */
  get target(): string {
    return this.source.target;
  }

  /** Get the value of the RuleElement. */
  get value(): boolean | number | string {
    return this.source.value;
  }

  /** Whether the RuleElement has errors */
  get hasErrors(): boolean {
    return hasErrors(this.messages);
  }

  /** Whether the RuleElement has warnings */
  get hasWarnings(): boolean {
    return hasWarnings(this.messages);
  }

  /** Whether this RuleElement has selected documents */
  get hasSelectedDocuments(): boolean {
    return !foundry.utils.isObjectEmpty(this.selectedDocuments);
  }

  /** Whether this RuleElement has document messages */
  get hasDocumentMessages(): boolean {
    return !foundry.utils.isObjectEmpty(this.documentMessages);
  }

  /** Whether the RuleElement has document related errors */
  get hasDocumentErrors(): boolean {
    return Object.values(this.documentMessages).some((value) =>
      hasErrors(value.messages)
    );
  }

  /** Whether the RuleElement has document related warnings */
  get hasDocumentWarnings(): boolean {
    return Object.values(this.documentMessages).some((value) =>
      hasWarnings(value.messages)
    );
  }

  /**
   * Apply this RuleElement to the given Documents.
   * If this RuleElement has errors or is disabled, this does nothing.
   * The RuleElement will only apply to those Documents that match its selector.
   */
  apply(
    documents: (WvActor | WvItem)[],
    { metConditions }: { metConditions: RuleElementCondition[] } = {
      metConditions: []
    }
  ): void {
    if (!this.shouldApply({ metConditions })) return;

    for (const document of documents) {
      if (!this.selects(document)) continue;

      this.addSelectedDocument(document);
      this.validateAgainstDocument(document);
      if (!this.shouldApplyTo(document)) continue;

      this.innerApply(document);
    }
  }

  /** Get the name of the given Document. */
  protected getDocName(document: WvActor | WvItem): string | null {
    // This has to be accessed in this way, because this can end up being called
    // when the `data` on an Actor or Item is not initialized yet.
    return document.data?._source.name ?? null;
  }

  /** Get the property of the given Document, the RuleElement points at. */
  protected getProperty(document: WvActor | WvItem): unknown {
    return foundry.utils.getProperty(document.data.data, this.target);
  }

  /** Set the property of the given Document, the RuleElement points at. */
  protected setProperty(document: WvActor | WvItem, value: unknown) {
    foundry.utils.setProperty(document.data.data, this.target, value);
  }

  /**
   * Validate the RuleElement itself and add messages to it. This should be
   * overriden by subclasses if needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected validate(): void {}

  /**
   * Check whether the value is of the given type.
   *
   * If the type is incorrect, an error message is added to the RuleElement.
   * @param expectedType - the type to check for
   */
  protected checkValueIsOfType(
    expectedType: "boolean" | "number" | "string"
  ): void {
    if (typeof this.value !== expectedType)
      this.messages.push(new WrongValueTypeMessage(expectedType));
  }

  /**
   * Validate the RuleElement against a Document and add any messages to the
   * RuleElement.
   */
  protected validateAgainstDocument(document: WvActor | WvItem): void {
    this.checkTargetIsValid(document);
  }

  /**
   * Add a message for the given document, initializing the messages array, if
   * it doesn't exist yet.
   */
  protected addDocumentMessage(
    document: WvActor | WvItem,
    message: RuleElementMessage
  ): void {
    if (document.id === null) {
      if (message.isError()) this.hasEphemeralDocumentErrors = true;

      LOG.warn(
        "Can't add document messages for ephemeral documents.",
        document
      );
      return;
    }

    const value = this.documentMessages[document.id];
    if (value === undefined)
      this.documentMessages[document.id] = {
        causeDocRelation: this.getDocRelation(document),
        messages: [message]
      };
    else value.messages.push(message);
  }

  /**
   * Get the relation between the owning Item and given document.
   * @throws if the given Document is not the owning Item, but the owning Item
   *         has no parent Actor
   * @throws if the given Document could not be found in the Actor or its owned
   *         Items
   */
  protected getDocRelation(document: WvActor | WvItem): DocumentRelation {
    if (isSameDocument(this.item, document)) return "thisItem";

    if (this.item.actor === null)
      throw new Error(
        "The cause document was not the owning item, but the owning item has no parent!"
      );

    if (document instanceof WvActor && isOwningActor(this.item, document))
      return "parentActor";

    if (document instanceof WvItem && isSiblingItem(this.item, document))
      return "parentOwnedItem";

    throw new Error(
      "Could not find the given Document's relation to the owning item!"
    );
  }

  /**
   * Check whether the target targets a property.
   *
   * If the target does not match, an error message is added to the RuleElement.
   * @throws if anything else than a TypeError is thrown by
   *         `foundry.utils.getProperty()`
   */
  protected checkTargetIsValid(document: WvActor | WvItem): void {
    let invalidTarget = false;

    try {
      invalidTarget = this.getProperty(document) === undefined;
    } catch (error) {
      if (error instanceof TypeError) {
        // This can happen, when the prefix part of a path finds a valid
        // property, which has a non-object value and the selector has further
        // parts.
        invalidTarget = true;
      } else {
        throw error;
      }
    }

    if (invalidTarget) {
      this.addDocumentMessage(
        document,
        new NotMatchingTargetMessage(this.target)
      );
    }
  }

  /**
   * Check whether the target property is of the given type.
   *
   * If the type is incorrect, an error message is added to the RuleElement.
   * @remarks When this is called, it should already be verified that the
   *          target actually matches a property.
   */
  protected checkTargetIsOfType(
    document: WvActor | WvItem,
    expectedType: "boolean" | "number" | "string"
  ): void {
    if (typeof this.getProperty(document) !== expectedType) {
      this.addDocumentMessage(
        document,
        new WrongTargetTypeMessage(this.target, expectedType)
      );
    }
  }

  /**
   * Check whether the target property will change.
   *
   * If the type changes, a warning message is added to the RuleElement.
   */
  protected checkTypeChanged(document: WvActor | WvItem): void {
    const originalType = typeof this.getProperty(document);
    const newType = typeof this.value;

    if (originalType !== newType) {
      this.addDocumentMessage(
        document,
        new ChangedTypeMessage(this.target, originalType, newType)
      );
    }
  }

  /**
   * Apply this RuleElement to the given document. All necessary checks should
   * have already been performed at this point. This should be overriden by
   * subclesses.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected innerApply(_document: WvActor | WvItem): void {}

  /**
   * Whether nothing prevents this RuleElement from applying to any Document.
   */
  private shouldApply(
    { metConditions }: { metConditions: RuleElementCondition[] } = {
      metConditions: []
    }
  ): boolean {
    return !this.hasErrors && this.enabled && this.conditionsMet(metConditions);
  }

  /**
   * Check whether the given met conditions meet the required conditions of
   * this RuleElement.
   */
  private conditionsMet(metConditions: RuleElementCondition[]): boolean {
    return !this.conditions.some(
      (condition) => !metConditions.includes(condition)
    );
  }

  /** Determine whether this rule element selects the given document. */
  private selects(document: WvActor | WvItem): boolean {
    return !this.selectors.some((selector) => !selector.selects(document));
  }

  /** Add the document to the tracked list of selected documents. */
  private addSelectedDocument(document: WvActor | WvItem) {
    if (document.id === null) {
      LOG.warn("Can't track selection of ephemeral documents.");
      return;
    }

    this.selectedDocuments[document.id] = {
      name: document.name ?? "",
      relation: this.getDocRelation(document)
    };
  }

  /**
   * Check whether nothing prevents this RuleElement from applying to the
   * given document. This assumes that that the RuleElement should apply in
   * general.
   */
  private shouldApplyTo(document: WvActor | WvItem): boolean {
    if (document.id === null && this.hasEphemeralDocumentErrors) return false;

    return !hasErrors(
      document.id === null
        ? []
        : this.documentMessages[document.id]?.messages ?? []
    );
  }
}

/** An value in the documentMessages object */
export interface DocumentMessagesValue {
  causeDocRelation: DocumentRelation;
  messages: RuleElementMessage[];
}

/** Check whether the given messages contain errors. */
export function hasErrors(messages: RuleElementMessage[]): boolean {
  return messages.some((message) => message.isError());
}

/** Check whether the given messages contain warnings. */
export function hasWarnings(messages: RuleElementMessage[]): boolean {
  return messages.some((message) => message.isWarning());
}

/** A sort function for RuleElements */
export function ruleElementSort(a: RuleElement, b: RuleElement): number {
  return a.priority - b.priority;
}

/** A filter function for RuleElements without conditions */
export function withoutConditions(rule: RuleElement): boolean {
  return rule.conditions.length === 0;
}

import WvActor from "../actor/wvActor.js";
import { TYPES } from "../constants.js";
import type { LabelComponent } from "../data/common.js";
import { AttacksProperties } from "../data/item/weapon/attack/properties.js";
import { RangesProperties } from "../data/item/weapon/ranges/properties.js";
import {
  isOwningActor,
  isSameDocument,
  isSiblingItem
} from "../foundryHelpers.js";
import type { DocumentRelation } from "../item/wvItem.js";
import WvItem from "../item/wvItem.js";
import DocumentSelector, { createSelector } from "./documentSelector.js";
import ChangedTypeMessage from "./messages/changedTypeMessage.js";
import NotMatchingTargetMessage from "./messages/notMatchingTargetMessage.js";
import WrongTargetTypeMessage from "./messages/wrongTargetTypeMessage.js";
import WrongValueTypeMessage from "./messages/wrongValueTypeMessage.js";
import type RuleElementMessage from "./ruleElementMessage.js";
import type { RuleElementSource } from "./ruleElementSource.js";
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
   * A RegExp to match a target against an attacks pattern. This can be used to
   * apply a RuleElement against all attacks of a weapon.
   */
  static ATTACKS_TARGET_REGEXP =
    /@attacks(?:\[(?<tags>[^,]+(?:,[^,]+)*)\])?\|(?<path>\w+(?:\.\w+)*)/;

  /**
   * A RegExp to match a target against a ranges pattern. This can be used to
   * apply a RuleElement against all ranges of a weapon.
   */
  static RANGES_TARGET_REGEXP =
    /@ranges(?:\[(?<tags>[^,]+(?:,[^,]+)*)\])?\|(?<path>\w+(?:\.\w+)*)/;

  /**
   * Create a RuleElement from the given data and owning item.
   * @param source - the source data for the RuleElement
   * @param item   - the owning item
   */
  constructor(
    /** The source data of the RuleElement */
    public source: RuleElementSource,

    /** The owning Item of the RuleElement */
    public item: WvItem
  ) {
    this.validate();
    this.selectors =
      this.source.selectors?.map((source) =>
        createSelector(this.item, source)
      ) ?? [];
    this.attackRegexpMatch = RuleElement.ATTACKS_TARGET_REGEXP.exec(
      this.source.target
    );
    this.rangesRegexpMatch = RuleElement.RANGES_TARGET_REGEXP.exec(
      this.source.target
    );
  }

  /** Messages that were accumulated while validating the source. */
  messages: RuleElementMessage[] = [];

  /**
   * Document IDs mapping to arrays of messages, specific to the respective
   * Document.
   */
  documentMessages: Map<WvActor | WvItem, DocumentMessagesValue> = new Map();

  /** Get the filtering selectors of the RuleElement. */
  selectors: DocumentSelector[];

  /** Selected document IDs, mapping to their names */
  selectedDocuments: Map<WvActor | WvItem, { relation: DocumentRelation }> =
    new Map();

  /** A potential RegExp match against the attacks target pattern */
  attackRegexpMatch: RegExpExecArray | null;

  /** A potential RegExp match against the ranges target pattern */
  rangesRegexpMatch: RegExpExecArray | null;

  /** Get the conditions for this RuleElement. */
  get conditions(): RuleElementCondition[] {
    return this.source.conditions ?? [];
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
    if (this.attackRegexpMatch) {
      const path = this.attackRegexpMatch.groups?.path;
      if (path === undefined)
        throw new Error("There was no path after splitting!");
      return path;
    }

    if (this.rangesRegexpMatch) {
      const path = this.rangesRegexpMatch.groups?.path;
      if (path === undefined)
        throw new Error("There was no path after splitting!");
      return path;
    }

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
    return this.selectedDocuments.size > 0;
  }

  /** Whether this RuleElement has document messages */
  get hasDocumentMessages(): boolean {
    return this.documentMessages.size > 0;
  }

  /** Whether the RuleElement has document related errors */
  get hasDocumentErrors(): boolean {
    return [...this.documentMessages.values()].some((value) =>
      hasErrors(value.messages)
    );
  }

  /** Whether the RuleElement has document related warnings */
  get hasDocumentWarnings(): boolean {
    return [...this.documentMessages.values()].some((value) =>
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

  /** Get the properties of the given Document, the RuleElement targets. */
  protected getProperties(document: WvActor | WvItem): unknown[] {
    if (this.attackRegexpMatch && document.data.type === TYPES.ITEM.WEAPON) {
      return AttacksProperties.getMatching(
        document.data.data.attacks,
        this.attackRegexpMatch?.groups?.tags?.split(",")
      ).map((attack) => foundry.utils.getProperty(attack, this.target));
    }

    if (this.rangesRegexpMatch && document.data.type === TYPES.ITEM.WEAPON) {
      return RangesProperties.getMatching(
        document.data.data.ranges,
        this.rangesRegexpMatch?.groups?.tags?.split(",")
      ).map((range) => foundry.utils.getProperty(range, this.target));
    }

    return [foundry.utils.getProperty(document.data.data, this.target)];
  }

  /**
   * Map the targeted properties of a document. If the mapping function does not
   * return a value, this assumes that the property has already been modified.
   * Otherwise the property is set with {@link foundry.utils.setProperty}.
   */
  protected mapProperties(
    document: WvActor | WvItem,
    callback: (value: unknown) => unknown
  ) {
    if (this.attackRegexpMatch && document.data.type === TYPES.ITEM.WEAPON) {
      AttacksProperties.getMatching(
        document.data.data.attacks,
        this.attackRegexpMatch.groups?.tags?.split(",")
      ).forEach((attack) =>
        callback(foundry.utils.getProperty(attack, this.target))
      );

      return;
    }

    if (this.rangesRegexpMatch && document.data.type === TYPES.ITEM.WEAPON) {
      RangesProperties.getMatching(
        document.data.data.ranges,
        this.rangesRegexpMatch.groups?.tags?.split(",")
      ).forEach((range) =>
        callback(foundry.utils.getProperty(range, this.target))
      );

      return;
    }

    const modifiedProperty = callback(
      foundry.utils.getProperty(document.data.data, this.target)
    );
    if (modifiedProperty !== undefined)
      foundry.utils.setProperty(
        document.data.data,
        this.target,
        modifiedProperty
      );
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
    if (this.documentMessages.has(document)) {
      this.documentMessages.get(document)?.messages.push(message);
    } else {
      this.documentMessages.set(document, {
        causeDocRelation: this.getDocRelation(document),
        messages: [message]
      });
    }
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
      invalidTarget = this.getProperties(document).some(
        (value) => value === undefined
      );
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
    if (
      this.getProperties(document).some(
        (value) => typeof value !== expectedType
      )
    ) {
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
    for (const value of this.getProperties(document)) {
      const originalType = typeof value;
      const newType = typeof this.value;

      if (originalType !== newType) {
        this.addDocumentMessage(
          document,
          new ChangedTypeMessage(this.target, originalType, newType)
        );
        break;
      }
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
    this.selectedDocuments.set(document, {
      relation: this.getDocRelation(document)
    });
  }

  /**
   * Check whether nothing prevents this RuleElement from applying to the
   * given document. This assumes that that the RuleElement should apply in
   * general.
   */
  private shouldApplyTo(document: WvActor | WvItem): boolean {
    return !hasErrors(this.documentMessages.get(document)?.messages ?? []);
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

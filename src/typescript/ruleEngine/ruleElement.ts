import FlatModifier from "./ruleElements/flatModifier.js";

/**
 * A rule engine element, allowing the modification of a data point, specified
 * by a selector by a given value. How the data point is modified depends on the
 * type of the element.
 */
export default abstract class RuleElement {
  /** A mapping of type identifiers to RuleElement constructors. */
  static TYPES: Partial<Record<string, RuleElementConstructor>> = {
    [FlatModifier.TYPE]: FlatModifier
  };

  /**
   * Create a new RuleElement from an unknown JSON object.
   * @param json - the unknow, serialized JSON object
   * @returns a RuleElement if the needed properties existed, null otherwise
   */
  static fromJson(json: unknown): RuleElement | null {
    if (typeof json !== "object" || !json) return null;

    const rule: Partial<RuleElement> = json;
    if (!rule.type || typeof rule.type !== "string") return null;

    const constructor = RuleElement.TYPES[rule.type];
    if (!constructor) return null;

    return constructor.fromJson(json);
  }

  /** The label of the element */
  abstract readonly label: string;

  /** The selector of the element */
  abstract readonly selector: string;

  /** The value of the element */
  abstract readonly value: number;

  /** The type identifier of the element */
  abstract readonly type: string;

  /**
   * Modify the passed Document.
   * @param doc - the Document to modify
   */
  abstract modify(doc: Actor | Item): void;
}

// TODO: enforce this better on the subclasses
/** An interface to describe the static side of RuleElements. */
export interface RuleElementConstructor extends ConstructorOf<RuleElement> {
  /** The type identifier for this RuleElement */
  readonly TYPE: string;

  /**
   * Create a new RuleElement from an unknown JSON object.
   * @param json - the unknow, serialized JSON object
   * @returns a RuleElement if the needed properties existed, null otherwise
   */
  fromJson(json: unknown): RuleElement | null;
}

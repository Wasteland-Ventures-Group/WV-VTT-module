import type { JSONSchemaType } from "ajv";

/** The data layout needed to create a CompositeNumber from raw data. */
export interface CompositeNumberSource {
  source: number;
}

/** A class to represent numbers composed of a base and modifying components. */
export class CompositeNumber implements CompositeNumberSource {
  /**
   * Test whether the given source is a CompositeNumberSource.
   * @param source - the source to test
   * @returns whether the source is a CompositeNumberSource
   */
  static isSource(source: unknown): source is CompositeNumberSource {
    return (
      typeof source === "object" &&
      null !== source &&
      "source" in source &&
      typeof (source as CompositeNumberSource).source === "number"
    );
  }

  /**
   * Create a CompositeNumber from the given source
   * @param source - either a CompositeNumber or CompositeNumberSource
   * @returns the created CompositeNumber
   * @throws if the given source is neither a CompositeNumber or CompositeNumberSource
   */
  static from(source: unknown): CompositeNumber {
    if (source instanceof CompositeNumber) return source;

    if (this.isSource(source)) {
      return new CompositeNumber(source.source);
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /** Create a new CompositeNumber with the given source value. */
  constructor(source = 0) {
    this.source = source;
    this.#components = [];
  }

  /** The internal components of the CompositeNumber */
  #components: Component[];

  /** The source value of the CompositeNumber */
  source: number;

  /** The total value of the CompositeNumber */
  get total() {
    return (
      this.source +
      this.#components.reduce((total, component) => {
        return total + component.value;
      }, 0)
    );
  }

  /**
   * Add the given Component to the CompositeNumber.
   * @param component - the component to add
   */
  add(component: Component) {
    this.#components.push(component);
  }
}

/** A CompositeNumber component */
interface Component {
  /** The value this component modifies the CompositeNumber's value by */
  value: number;

  /** An explanatory label for the Component */
  label: string;
}

export const COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA: JSONSchemaType<CompositeNumberSource> =
  {
    description: "A schema for modifiable number sources",
    type: "object",
    properties: {
      source: {
        description:
          "The source value of the number This can be in the database, in which case it should not be modified aside from user input.",
        type: "number"
      }
    },
    required: ["source"],
    additionalProperties: false
  };

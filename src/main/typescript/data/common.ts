import type { JSONSchemaType } from "ajv";
import { FoundrySerializable, Resource } from "./foundryCommon.js";

/** The data layout needed to create a CompositeNumber from raw data. */
export interface CompositeNumberSource {
  source: number;
}

/** The data layout for a serialized composite number. */
export interface SerializedCompositeNumber extends CompositeNumberSource {
  components: Component[];
}

/** A class to represent numbers composed of a base and modifying components. */
export class CompositeNumber
  implements CompositeNumberSource, FoundrySerializable
{
  /**
   * Test whether the given source is a CompositeNumberSource.
   * @param source - the source to test
   * @returns whether the source is a CompositeNumberSource
   */
  static isSource(source: unknown): source is CompositeNumberSource {
    if (typeof source !== "object" || null === source || !("source" in source))
      return false;

    const obj = source as CompositeNumberSource;
    return typeof obj.source === "number";
  }

  /**
   * Test whether the given source is a SerializedCompositeNumber.
   * @param source - the source to test
   * @returns whether the source is a SerializedCompositeNumber
   */
  static isSerialized(source: unknown): source is SerializedCompositeNumber {
    if (!this.isSource(source) || !("components" in source)) return false;

    const obj = source as SerializedCompositeNumber;
    return (
      Array.isArray(obj.components) &&
      !obj.components.some((component) => !isComponent(component))
    );
  }

  /**
   * Create a CompositeNumber from the given source
   * @param source - either a CompositeNumber, CompositeNumberSource or SerializedCompositeNumber
   * @returns the created CompositeNumber
   * @throws if the given source is neither a CompositeNumber, CompositeNumberSource nor SerializedCompositeNumber
   */
  static from(source: unknown): CompositeNumber {
    if (source instanceof CompositeNumber) return source;

    if (this.isSource(source)) {
      const compNumber = new CompositeNumber(source.source);

      if (this.isSerialized(source)) {
        source.components.forEach((component) => compNumber.add(component));
      }

      return compNumber;
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /** Create a new CompositeNumber with the given source value. */
  constructor(
    /** The source value of the CompositeNumber */
    public source = 0
  ) {
    this.#components = [];
  }

  /** The internal components of the CompositeNumber */
  #components: Component[];

  /** Get the components that make up this CompositeNumber beyond the source. */
  get components(): Component[] {
    return this.#components;
  }

  /** The total value of the CompositeNumber */
  get total() {
    return this.#components.reduce((total, component) => {
      return total + component.value;
    }, this.source);
  }

  /**
   * Add the given Component to the CompositeNumber.
   * @param component - the component to add
   */
  add(component: Component) {
    this.#components.push(component);
  }

  toObject(source?: true): CompositeNumberSource;
  toObject(source: false): SerializedCompositeNumber;
  toObject(source?: boolean): CompositeNumberSource | SerializedCompositeNumber;
  toObject(
    source?: boolean
  ): CompositeNumberSource | SerializedCompositeNumber {
    if (source) {
      return { source: this.source };
    } else {
      return {
        source: this.source,
        components: this.#components
      };
    }
  }

  /** Clone this CompositeNumber. */
  clone(): CompositeNumber {
    const clone = new CompositeNumber(this.source);

    for (const component of this.#components) {
      clone.add(component);
    }

    return clone;
  }
}

/** A CompositeNumber component */
export interface Component {
  /** The value this component modifies the CompositeNumber's value by */
  value: number;

  /** An explanatory label for the Component */
  label: string;
}

/** Check whether the given source is a Component. */
export function isComponent(source: unknown): source is Component {
  if (
    typeof source !== "object" ||
    null === source ||
    !("value" in source) ||
    !("label" in source)
  )
    return false;

  const obj = source as Component;
  return typeof obj.value === "number" && typeof obj.label === "string";
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

/**
 * A class for what Foundry VTT will automatically recognize as a "resource",
 * where the maximum can be composed like a CompositeNumber.
 */
export class CompositeResource extends CompositeNumber implements Resource {
  /**
   * Create a CompositeResource from the given source
   * @param source - either a CompositeResource or CompositeResourceSource
   * @returns the created CompositeResource
   * @throws if the given source is neither a CompositeResource or CompositeResourceSource
   */
  static override from(source: unknown): CompositeResource {
    if (source instanceof CompositeResource) return source;

    if (Resource.isSource(source)) {
      return new CompositeResource(source.value, source.value);
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /**
   * Create a new CompositeResource with the given value and and source for the
   * maximum.
   */
  constructor(public value: number, public source: number) {
    super(source);
  }

  /** Get the max value of the resource. This is an alias for total. */
  get max(): number {
    return this.total;
  }

  /** Clone this CompositeResource. */
  override clone(): CompositeResource {
    const clone = new CompositeResource(this.value, this.source);

    for (const component of this.components) {
      clone.add(component);
    }

    return clone;
  }
}

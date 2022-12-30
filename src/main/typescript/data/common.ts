import type { JSONSchemaType } from "ajv";
import { z } from "zod";
import { getGame } from "../foundryHelpers.js";
import type { WvI18nKey } from "../lang.js";
import { FoundrySerializable, Resource } from "./foundryCommon.js";

/** The data layout needed to create a CompositeNumber from raw data. */
export type CompositeNumberSource = z.infer<typeof COMP_NUM_SCHEMA>;
export const COMP_NUM_SCHEMA = z.object({
  /** The source value for a composite number */
  source: z.number().default(0)
});

/** The bounds of a composite number */
export interface CompositeNumberBounds {
  min?: number | undefined;
  max?: number | undefined;
}

// TODO: remove me
export const CompositeNumberSchema = z
  .object({ source: z.number().default(0) })
  .default({});

/** The data layout for a serialized composite number. */
export interface SerializedCompositeNumber extends CompositeNumberSource {
  bounds?: CompositeNumberBounds;
  components: ComponentSource[];
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
      !obj.components.some((component) => !Component.isSource(component))
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
        compNumber.bounds = source.bounds ?? {};
        source.components.forEach((component) => compNumber.add(component));
      }

      return compNumber;
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /** Create a new CompositeNumber with the given source value. */
  constructor(
    /** The source value of the CompositeNumber */
    public source = 0,
    public bounds: CompositeNumberBounds = {}
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
    let sum = this.#components.reduce((total, component) => {
      return total + component.value;
    }, this.source);

    if (typeof this.bounds.min === "number" && sum < this.bounds.min)
      sum = this.bounds.min;

    if (typeof this.bounds.max === "number" && sum > this.bounds.max)
      sum = this.bounds.max;

    return sum;
  }

  /**
   * Add the given Component to the CompositeNumber.
   * @param component - the component to add
   */
  add(component: ComponentSource | Component) {
    this.#components.push(
      component instanceof Component
        ? component
        : new Component(component.value, component.labelComponents)
    );
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
        bounds: this.bounds,
        components: this.#components.map((component) =>
          component.toObject(source)
        ),
        source: this.source
      };
    }
  }

  /** Clone this CompositeNumber. */
  clone(): CompositeNumber {
    const clone = new CompositeNumber(this.source, this.bounds);

    for (const component of this.#components) {
      clone.add(component);
    }

    return clone;
  }
}

/** A component of a label for a Component. */
export type LabelComponent = { text: string } | { key: WvI18nKey };

/** Test whether the given object is a LabelComponent. */
export function isLabelComponent(object: unknown): object is LabelComponent {
  if (typeof object !== "object" || null === object) return false;

  const comp = object as LabelComponent;
  if ("key" in comp && typeof comp.key === "string") {
    return getGame().i18n.localize(comp.key) !== comp.key;
  }

  return "text" in comp && typeof comp.text === "string";
}

/** A CompositeNumber Component source */
export interface ComponentSource {
  /** The value this component modifies the CompositeNumber's value by */
  value: number;

  /** An explanatory label for the Component */
  labelComponents: LabelComponent[];
}

/** A Component of a CompositeNumber */
export class Component implements ComponentSource, FoundrySerializable {
  /**
   * Test whether the given source is a ComponentSource.
   * @param source - the source to test
   * @returns whether the source is a ComponentSource
   */
  static isSource(source: unknown): source is ComponentSource {
    if (
      typeof source !== "object" ||
      null === source ||
      !("value" in source) ||
      !("labelComponents" in source)
    )
      return false;

    const obj = source as ComponentSource;
    return (
      typeof obj.value === "number" &&
      Array.isArray(obj.labelComponents) &&
      !obj.labelComponents.some(
        (labelComponent) => !isLabelComponent(labelComponent)
      )
    );
  }

  /**
   * Create a Component from the given source
   * @param source - either a Component or ComponentSource
   * @returns the created Component
   * @throws if the given source is neither a Component nor ComponentSource
   */
  static from(source: unknown): Component {
    if (source instanceof Component) return source;

    if (this.isSource(source))
      return new Component(source.value, source.labelComponents);

    throw new Error(`The source was not valid: ${source}`);
  }

  /** Create a new Component with the given value and label components. */
  constructor(public value: number, public labelComponents: LabelComponent[]) {}

  /**
   * Construct a label out of the label components of this Component. This
   * localizes "key" components and leaves "text" components as they are.
   */
  get label(): string {
    return this.labelComponents
      .map((labelComponent) =>
        "key" in labelComponent
          ? getGame().i18n.localize(labelComponent.key)
          : labelComponent.text
      )
      .join(" ");
  }

  toObject(_source?: boolean): ComponentSource {
    return {
      value: this.value,
      labelComponents: this.labelComponents
    };
  }
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
      const compResource = new CompositeResource(source.value, source.value);

      if (CompositeNumber.isSerialized(source)) {
        compResource.bounds = source.bounds ?? {};
        source.components.forEach((component) => compResource.add(component));
      }

      return compResource;
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /**
   * Create a new CompositeResource with the given value and and source for the
   * maximum.
   */
  constructor(
    public value: number,
    public source: number,
    public bounds: CompositeNumberBounds = {}
  ) {
    super(source, bounds);
  }

  /** Get the max value of the resource. This is an alias for total. */
  get max(): number {
    return this.total;
  }

  /** Clone this CompositeResource. */
  override clone(): CompositeResource {
    const clone = new CompositeResource(this.value, this.source, this.bounds);

    for (const component of this.components) {
      clone.add(component);
    }

    return clone;
  }
}

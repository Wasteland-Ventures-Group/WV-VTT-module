import { z } from "zod";
import { getGame } from "../foundryHelpers.js";
import type { WvI18nKey } from "../lang.js";
import {
  FoundrySerializable,
  Resource,
  RESOURCE_SOURCE_SCHEMA
} from "./foundryCommon.js";

/** The data layout needed to create a CompositeNumber from raw data. */
export type CompositeNumberSource = z.infer<
  typeof COMPOSITE_NUMBER_SOURCE_SCHEMA
>;
export const COMPOSITE_NUMBER_SOURCE_SCHEMA = z.object({
  /** The source value for a composite number */
  source: z
    .number()
    .default(0)
    .describe("The source value for a composite number")
});

/** The bounds of a composite number */
export type CompositeNumberBounds = z.infer<
  typeof COMPOSITE_NUMBER_BOUNDS_SCHEMA
>;

export const COMPOSITE_NUMBER_BOUNDS_SCHEMA = z.object({
  min: z.number().optional(),
  max: z.number().optional()
});

/** The data layout for a serialized composite number. */
export type SerializedCompositeNumber = z.infer<
  typeof SERIALIZED_COMPOSITE_NUMBER_SCHEMA
>;

/** A class to represent numbers composed of a base and modifying components. */
export class CompositeNumber
  implements CompositeNumberSource, FoundrySerializable
{
  /**
   * Create a CompositeNumber from the given source
   * @param unknownSource - either a CompositeNumber, CompositeNumberSource or SerializedCompositeNumber
   * @returns the created CompositeNumber
   * @throws if the given source is neither a CompositeNumber, CompositeNumberSource nor SerializedCompositeNumber
   */
  static from(unknownSource: unknown): CompositeNumber {
    if (unknownSource instanceof CompositeNumber) return unknownSource;
    const source = SERIALIZED_COMPOSITE_NUMBER_SCHEMA.parse(unknownSource);

    const compNumber = new CompositeNumber(source.source);

    // Since the serialized composite number schema's components are empty by
    // default, this means that a CompositeNumberSource simply produces
    // no-ops here.
    compNumber.bounds = source.bounds ?? {};
    source.components.forEach((component) => compNumber.add(component));

    return compNumber;
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

/**
 * Parsing scheme for i18n translation keys. Cannot be declared in lang.ts, as
 * lang.ts is imported during gulp tasks
 */
export const WVI18N_KEY_SCHEMA = z.custom<WvI18nKey>(
  (val) => {
    if (typeof val !== "string") return false;
    const i18n = getGame().i18n;
    return i18n.localize(val) !== val;
  },
  (val) => {
    let message;
    if (typeof val !== "string")
      message = `Wrong type. Expected string, got ${typeof val}`;
    else
      message = `Invalid Key: ${val} (localization returned ${getGame().i18n.localize(
        val
      )})`;
    return { message };
  }
);

/** A component of a label for a Component. */
export type LabelComponent = z.infer<typeof LABEL_COMPONENT_SCHEMA>;
const LABEL_COMPONENT_SCHEMA = z.union([
  z.object({ text: z.string() }),
  z.object({ key: WVI18N_KEY_SCHEMA })
]);

/** A CompositeNumber Component source */
export type ComponentSource = z.infer<typeof COMPONENT_SOURCE_SCHEMA>;
export const COMPONENT_SOURCE_SCHEMA = z.object({
  /** The value this component modifies the CompositeNumber's value by */
  value: z
    .number()
    .describe(
      "The value this component modifies the CompositeNumber's value by"
    ),

  /** An explanatory label for the Component */
  labelComponents: LABEL_COMPONENT_SCHEMA.array().describe(
    "An explanatory label for the Component"
  )
});

/**
 * Parses a serialized composite number (or a regular composite number source)
 */
const SERIALIZED_COMPOSITE_NUMBER_SCHEMA =
  COMPOSITE_NUMBER_SOURCE_SCHEMA.extend({
    bounds: COMPOSITE_NUMBER_BOUNDS_SCHEMA.optional(),
    components: COMPONENT_SOURCE_SCHEMA.array().default([])
  });

/** A Component of a CompositeNumber */
export class Component implements ComponentSource, FoundrySerializable {
  /**
   * Create a Component from the given source
   * @param sourceUnknown - either a Component or ComponentSource
   * @returns the created Component
   * @throws if the given source is neither a Component nor ComponentSource
   */
  static from(sourceUnknown: unknown): Component {
    if (sourceUnknown instanceof Component) return sourceUnknown;

    const source = COMPONENT_SOURCE_SCHEMA.parse(sourceUnknown);

    return new Component(source.value, source.labelComponents);
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

    const parsedAsSource = RESOURCE_SOURCE_SCHEMA.safeParse(source);

    if (!parsedAsSource.success)
      throw new Error(`The source was not valid: ${source}`);

    const data = parsedAsSource.data;
    const compResource = new CompositeResource(data.value, data.value);

    const parsedAsSerializedCompNum =
      SERIALIZED_COMPOSITE_NUMBER_SCHEMA.strip().safeParse(source);
    if (parsedAsSerializedCompNum.success) {
      const compNum = parsedAsSerializedCompNum.data;
      compResource.bounds = compNum.bounds ?? {};
      compNum.components.forEach((component) => compResource.add(component));
    }

    return compResource;
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

/**
 * By default, zod's record parser is `Partial` when an enum is geven as a key
 * This function returns a parser that ensures all of its keys are present.
 * This is equivalent to a z.object(...).strict() with all the keys present
 * @param keys - The keys of the record type
 * @returns A zod schema for the record type
 */
export function fullRecord<T extends string>(
  keys: readonly [T, ...T[]]
): z.ZodType<Record<T, string>> {
  return fullRecordWithVal(keys, z.string());
}

/**
 * See `fullRecord`. Adds the option to use non-string values
 * @param keys - The keys of the record type
 * @param value - The zod schema for the record's values
 * @returns A zod schema for the record type
 */
export function fullRecordWithVal<T extends string, U>(
  keys: readonly [T, ...T[]],
  value: z.ZodType<U>
): z.ZodType<Record<T, U>> {
  const schema = z.record(z.enum(keys), value).superRefine((val, ctx) => {
    for (const key of keys) {
      if (!(key in val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing key ${key}`
        });
      }
    }
  });

  return schema as z.ZodType<Record<T, U>>;
}

/**
 * See `fullRecord`. Adds the ability to set a default for absent keys.
 * @param keys - The keys of the record type
 * @param value - The zod schema for the record's values
 * @param defaultValue - The default value for absent keys
 * @returns A zod schema for the record type
 */
export function fullRecordWithDefault<T extends string, U>(
  keys: readonly [T, ...T[]],
  value: z.ZodType<U>,
  defaultValue: U
): z.ZodDefault<z.ZodType<Record<T, U>>> {
  const schema = fullRecordWithVal(keys, value);
  const defaults = keys.reduce((acc, key) => {
    acc[key] = defaultValue;
    return acc;
  }, {} as Record<T, U>);
  const result = schema.default(defaults);

  return result;
}

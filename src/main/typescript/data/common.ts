import type { JSONSchemaType } from "ajv";
import Prompt, {
  CheckboxInputSpec,
  NumberInputSpec,
  TextInputSpec
} from "../applications/prompt.js";
import { getGame } from "../foundryHelpers.js";
import type { WvI18nKey } from "../lang.js";
import { FoundrySerializable, Resource } from "./foundryCommon.js";

/** The data layout needed to create a CompositeNumber from raw data. */
export interface CompositeNumberSource {
  source: number;
}

/** The data layout for a serialized composite number. */
export interface SerializedCompositeNumber extends CompositeNumberSource {
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
        source: this.source,
        components: this.#components.map((component) =>
          component.toObject(source)
        )
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

// Unsure if there should be an explicit boolean here to switch between Checks and Attacks
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null
): Promise<ExternalCheckData>;
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null,
  defaultRange: number
): Promise<ExternalAttackData>;
/**
 * Creates the Prompt for the external data for a roll
 * @param title - The title of the roll
 * @param actorName - The name of the actor
 * @param defaultRange - The default range to put in the roll (only for attack rolls)
 * @returns A Prompt object
 */
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null,
  defaultRange?: number
): Promise<ExternalRollData> {
  const i18n = getGame().i18n;
  const commonData: PromptSpecCommon = {
    alias: {
      type: "text",
      label: i18n.localize("wv.system.misc.speakerAlias"),
      value: actorName
    },
    modifier: {
      type: "number",
      label: modifierLabel ?? i18n.localize("wv.system.misc.modifier"),
      value: 0,
      min: -100,
      max: 100
    },
    whisperToGms: {
      type: "checkbox",
      label: i18n.localize("wv.system.rolls.whisperToGms"),
      value: getGame().user?.isGM
    }
  };
  if (defaultRange !== undefined) {
    const data: PromptSpecAttack = {
      ...commonData,
      range: {
        type: "number",
        label: i18n.localize("wv.rules.range.distance.name"),
        value: defaultRange,
        min: 0,
        max: 99999
      }
    };
    return Prompt.get<PromptSpecAttack>(data, { title });
  } else {
    const data: PromptSpecCheck = {
      ...commonData
    };
    return Prompt.get<PromptSpecCheck>(data, { title });
  }
}

export type ExternalRollData = ExternalAttackData | ExternalCheckData;
/** User-provided data for rolls */
export interface ExternalRollDataCommon {
  /** An alias for the rolling actor */
  alias: string;
  /** An optional modifier for the roll */
  modifier: number;
  /** Whether or not to whisper to GMs */
  whisperToGms: boolean;
}

export type ExternalAttackData = ExternalRollDataCommon & {
  /** The range to the target in metres */
  range: number;
};
export type ExternalCheckData = ExternalRollDataCommon;

/** The Prompt input spec for a general roll */
export type PromptSpecCommon = {
  alias: TextInputSpec;
  modifier: NumberInputSpec;
  whisperToGms: CheckboxInputSpec;
};

export type PromptSpecCheck = PromptSpecCommon;
export type PromptSpecAttack = PromptSpecCommon & {
  range: NumberInputSpec;
};

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

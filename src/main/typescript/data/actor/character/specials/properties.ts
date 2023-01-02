import { z } from "zod";
import {
  RadiationSicknessLevel,
  SpecialName,
  SpecialNames
} from "../../../../constants.js";
import {
  ComponentSource,
  Component,
  LabelComponent,
  CompositeNumberBounds,
  COMPOSITE_NUMBER_BOUNDS_SCHEMA,
  COMPONENT_SOURCE_SCHEMA
} from "../../../common.js";
import type { FoundrySerializable } from "../../../foundryCommon.js";

export type SpecialsProperties = Record<SpecialName, Special> & {
  /** Apply the given radiation sickness level and modify the temp SPECIALs. */
  applyRadiationSickness(sicknessLevel: RadiationSicknessLevel): void;
};

export const SpecialsProperties = {
  /** Creates a new SpecialsProperties */
  from(): SpecialsProperties {
    const specials = SpecialNames.reduce((acc, specialName) => {
      acc[specialName] = new Special();
      return acc;
    }, {} as Record<SpecialName, Special>);
    return {
      ...specials,
      /** Apply the given radiation sickness level and modify the temp SPECIALs. */
      applyRadiationSickness(sicknessLevel: RadiationSicknessLevel) {
        const labelComponents: LabelComponent[] = [
          { key: "wv.rules.radiation.name" }
        ];

        switch (sicknessLevel) {
          case "none":
            return;
          case "minor":
            this.endurance.addTemp({ value: -1, labelComponents });
            return;
          case "moderate":
            this.endurance.addTemp({ value: -2, labelComponents });
            this.agility.addTemp({ value: -1, labelComponents });
            return;
          case "major":
            this.endurance.addTemp({ value: -3, labelComponents });
            this.agility.addTemp({ value: -2, labelComponents });
            this.strength.addTemp({ value: -1, labelComponents });
            return;
          case "critical":
            this.endurance.addTemp({ value: -3, labelComponents });
            this.agility.addTemp({ value: -3, labelComponents });
            this.strength.addTemp({ value: -2, labelComponents });
            return;
        }
      }
    };
  }
};

/** The layout for a serialized Special. */
export type SerializedSpecial = z.infer<typeof SERIALIZED_SPECIAL_SCHEMA>;

const SERIALIZED_SPECIAL_SCHEMA = z.object({
  permBounds: COMPOSITE_NUMBER_BOUNDS_SCHEMA.optional(),
  tempBounds: COMPOSITE_NUMBER_BOUNDS_SCHEMA.optional(),
  points: z.number().int(),
  permComponents: COMPONENT_SOURCE_SCHEMA.array(),
  tempComponents: COMPONENT_SOURCE_SCHEMA.array()
});

/** A SPECIAL, holding all intermediary steps for the final result */
export class Special implements FoundrySerializable {
  /**
   * Create a Special from the given source
   * @param source - either a Special or SerializedSpecial
   * @returns the created Special
   * @throws if the given source is neither a Special or SerializedSpecial
   */
  static from(source: unknown): Special {
    if (source instanceof Special) return source;

    const parsedAsSerialized = SERIALIZED_SPECIAL_SCHEMA.safeParse(source);

    if (!parsedAsSerialized.success)
      throw new Error(`The source was not valid: ${source}`);

    const data = parsedAsSerialized.data;
    const special = new Special(data.points, data.permBounds, data.tempBounds);
    data.permComponents.forEach((component) => special.addPerm(component));
    data.tempComponents.forEach((component) => special.addTemp(component));
    return special;
  }

  /** Create a new SPECIAL. */
  constructor(
    public points = 0,
    public permBounds: CompositeNumberBounds = {},
    public tempBounds: CompositeNumberBounds = {}
  ) {
    this.#permComponents = [];
    this.#tempComponents = [];
  }

  /** The internal permanent components of the SPECIAL */
  #permComponents: Component[];

  /** The internal temporary components of the SPECIAL */
  #tempComponents: Component[];

  /** Get the components that make up the permanent SPECIAL beyond points. */
  get permComponents(): Component[] {
    return this.#permComponents;
  }

  /** Get the components that make up the temporary SPECIAL beyond points. */
  get tempComponents(): Component[] {
    return this.#tempComponents;
  }

  /** Get the permanent modifier value. */
  get permModifier(): number {
    return this.#permComponents.reduce((total, component) => {
      return total + component.value;
    }, 0);
  }

  /** Get the temporary modifier value. This excludes the permanent modifier. */
  get tempModifier(): number {
    return this.#tempComponents.reduce((total, component) => {
      return total + component.value;
    }, 0);
  }

  /** Get the permanent total. */
  get permTotal(): number {
    let sum = this.points + this.permModifier;

    if (typeof this.permBounds.min === "number" && sum < this.permBounds.min)
      sum = this.permBounds.min;

    if (typeof this.permBounds.max === "number" && sum > this.permBounds.max)
      sum = this.permBounds.max;

    return sum;
  }

  /** Get the temporary total. */
  get tempTotal(): number {
    let sum = this.points + this.permModifier + this.tempModifier;

    if (typeof this.tempBounds.min === "number" && sum < this.tempBounds.min)
      sum = this.tempBounds.min;

    if (typeof this.tempBounds.max === "number" && sum > this.tempBounds.max)
      sum = this.tempBounds.max;

    return sum;
  }

  /**
   * Add the given Component to the permanent components of the SPECIAL.
   * @param component - the component to add
   */
  addPerm(component: ComponentSource | Component) {
    this.#permComponents.push(
      component instanceof Component
        ? component
        : new Component(component.value, component.labelComponents)
    );
  }

  /**
   * Add the given Component to the temporary components of the SPECIAL.
   * @param component - the component to add
   */
  addTemp(component: ComponentSource | Component) {
    this.#tempComponents.push(
      component instanceof Component
        ? component
        : new Component(component.value, component.labelComponents)
    );
  }

  toObject(source?: true): Record<string, never>;
  toObject(source: false): SerializedSpecial;
  toObject(source?: boolean): Record<string, never> | SerializedSpecial {
    if (source) {
      return {};
    } else {
      return {
        points: this.points,
        permBounds: this.permBounds,
        permComponents: this.#permComponents.map((component) =>
          component.toObject(source)
        ),
        tempBounds: this.tempBounds,
        tempComponents: this.#tempComponents.map((component) =>
          component.toObject(source)
        )
      };
    }
  }
}

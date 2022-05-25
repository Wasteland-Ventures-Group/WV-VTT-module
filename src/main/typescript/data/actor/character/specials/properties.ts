import type { SpecialName } from "../../../../constants.js";
import { Component, isComponent } from "../../../common.js";
import type { FoundrySerializable } from "../../../foundryCommon.js";

export default class SpecialsProperties
  implements Record<SpecialName, Special>
{
  /** The Strength SPECIAL of the character */
  strength = new Special();

  /** The Perception SPECIAL of the character */
  perception = new Special();

  /** The Endurance SPECIAL of the character */
  endurance = new Special();

  /** The Charisma SPECIAL of the character */
  charisma = new Special();

  /** The Intelligence SPECIAL of the character */
  intelligence = new Special();

  /** The Agility SPECIAL of the character */
  agility = new Special();

  /** The Luck SPECIAL of the character */
  luck = new Special();
}

/** The layout for a serialized Special. */
export interface SerializedSpecial {
  points: number;
  permComponents: Component[];
  tempComponents: Component[];
}

/** A SPECIAL, holding all intermediary steps for the final result */
export class Special implements FoundrySerializable {
  /**
   * Test whether the given source is a SerializedSpecial.
   * @param source - the source to test
   * @returns whether the source is a SerializedSpecial
   */
  static isSerialized(source: unknown): source is SerializedSpecial {
    if (
      typeof source !== "object" ||
      null === source ||
      !("points" in source) ||
      !("permComponents" in source) ||
      !("tempComponents" in source)
    )
      return false;

    const obj = source as SerializedSpecial;
    return (
      typeof obj.points === "number" &&
      Array.isArray(obj.permComponents) &&
      !obj.permComponents.some((component) => !isComponent(component)) &&
      Array.isArray(obj.tempComponents) &&
      !obj.tempComponents.some((component) => isComponent(component))
    );
  }

  /**
   * Create a Special from the given source
   * @param source - either a Special or SerializedSpecial
   * @returns the created Special
   * @throws if the given source is neither a Special or SerializedSpecial
   */
  static from(source: unknown): Special {
    if (source instanceof Special) return source;

    if (this.isSerialized(source)) {
      const special = new Special(source.points);
      source.permComponents.forEach((component) => special.addPerm(component));
      source.tempComponents.forEach((component) => special.addTemp(component));
      return special;
    }

    throw new Error(`The source was not valid: ${source}`);
  }

  /**
   * Create a new SPECIAL.
   * @param points - the invested points of the SPECIAL
   */
  constructor(points = 0) {
    this.points = points;
    this.#permComponents = [];
    this.#tempComponents = [];
  }

  /** The invested points of the SPECIAL */
  points: number;

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

  /** Get the permanent SPECIAL total. */
  get permTotal(): number {
    return this.#permComponents.reduce((total, component) => {
      return total + component.value;
    }, this.points);
  }

  /** Get the temporary SPECIAL total. */
  get tempTotal(): number {
    return this.#tempComponents.reduce((total, component) => {
      return total + component.value;
    }, this.points);
  }

  /**
   * Add the given Component to the permanent components of the SPECIAL.
   * @param component - the component to add
   */
  addPerm(component: Component) {
    this.#permComponents.push(component);
  }

  /**
   * Add the given Component to the temporary components of the SPECIAL.
   * @param component - the component to add
   */
  addTemp(component: Component) {
    this.#tempComponents.push(component);
  }

  toObject(source?: true): Record<string, never>;
  toObject(source: false): SerializedSpecial;
  toObject(source?: boolean): Record<string, never> | SerializedSpecial {
    if (source) {
      return {};
    } else {
      return {
        points: this.points,
        permComponents: this.#permComponents,
        tempComponents: this.#tempComponents
      };
    }
  }
}

import * as foundry from "./foundryCommon.js";

/** This is a {@link foundry.Resource} with an additional modifier. */
export interface ModdedResource extends foundry.Resource {
  /** The modifier value of a resource */
  mod: number;
}

/** This represents an object that can be serialized to the `template.json`. */
export interface TemplateEntityType {
  /** Get the name of the entity, which should be used in the `template.json`. */
  getTypeName(): string;
}

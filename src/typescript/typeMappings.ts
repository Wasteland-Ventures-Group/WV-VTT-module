import { TYPES } from "./constants.js";
import Effect from "./item/effect.js";

/** Mappings of foundry document types to class constructors. */
export const TYPE_CONSTRUCTORS = {
  /** A mapping of foundry actor types to class constructors. */
  ACTOR: {},
  /** A mapping of foundry item types to class constructors. */
  ITEM: {
    [TYPES.ITEM.EFFECT]: Effect
  }
} as const;

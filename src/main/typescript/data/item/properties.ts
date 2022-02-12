import type AmmoDataProperties from "./ammo/properties.js";
import type EffectDataProperties from "./effect/properties.js";
import type WeaponDataProperties from "./weapon/properties.js";

/** A union for the data properties of all Item types */
export type WvItemDataProperties =
  | AmmoDataProperties
  | EffectDataProperties
  | WeaponDataProperties;

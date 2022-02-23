import type AmmoDataProperties from "./ammo/properties.js";
import type ApparelDataProperties from "./apparel/properties.js";
import type EffectDataProperties from "./effect/properties.js";
import type MiscDataProperties from "./misc/properties.js";
import type WeaponDataProperties from "./weapon/properties.js";

/** A union for the data properties of all Item types */
export type WvItemDataProperties =
  | AmmoDataProperties
  | ApparelDataProperties
  | EffectDataProperties
  | MiscDataProperties
  | WeaponDataProperties;

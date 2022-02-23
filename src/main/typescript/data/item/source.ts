import type AmmoDataSource from "./ammo/source.js";
import type ApparelDataSource from "./apparel/source.js";
import type EffectDataSource from "./effect/source.js";
import type MiscDataSource from "./misc/source.js";
import type WeaponDataSource from "./weapon/source.js";

/** A union for data sources of all Item types */
export type WvItemDataSource =
  | AmmoDataSource
  | ApparelDataSource
  | EffectDataSource
  | MiscDataSource
  | WeaponDataSource;

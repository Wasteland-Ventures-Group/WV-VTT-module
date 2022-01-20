import type EffectDataSource from "./effect/source.js";
import type WeaponDataSource from "./weapon/source.js";

/** A union for data sources of all Item types */
export type WvItemDataSource = EffectDataSource | WeaponDataSource;

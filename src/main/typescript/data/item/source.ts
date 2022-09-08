import type AmmoDataSource from "./ammo/source.js";
import type ApparelDataSource from "./apparel/source.js";
import type EffectDataSource from "./effect/source.js";
import type MagicDataSource from "./magic/source.js";
import type MiscDataSource from "./misc/source.js";
import type RaceDataSource from "./race/source.js";
import type WeaponDataSource from "./weapon/source.js";

export type WvItemDataSource =
  | AmmoDataSource
  | ApparelDataSource
  | EffectDataSource
  | MagicDataSource
  | MiscDataSource
  | RaceDataSource
  | WeaponDataSource;

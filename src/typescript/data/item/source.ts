import type { TYPES } from "../../constants.js";
import type EffectDataSource from "./effect/source.js";
import type WeaponDataSource from "./weapon/source.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PastDataSourceData {}
interface PastDataSource {
  type: typeof TYPES.ITEM.PAST;
  data: PastDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface QuirkDataSourceData {}
interface QuirkDataSource {
  type: typeof TYPES.ITEM.QUIRK;
  data: QuirkDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TraitDataSourceData {}
interface TraitDataSource {
  type: typeof TYPES.ITEM.TRAIT;
  data: TraitDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PerkDataSourceData {}
interface PerkDataSource {
  type: typeof TYPES.ITEM.PERK;
  data: PerkDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpellDataSourceData {}
interface SpellDataSource {
  type: typeof TYPES.ITEM.SPELL;
  data: SpellDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkDataSourceData {}
interface MarkDataSource {
  type: typeof TYPES.ITEM.MARK;
  data: MarkDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SchematicDataSourceData {}
interface SchematicDataSource {
  type: typeof TYPES.ITEM.SCHEMATIC;
  data: SchematicDataSourceData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AerialManeuverDataSourceData {}
interface AerialManeuverDataSource {
  type: typeof TYPES.ITEM.AERIAL_MANEUVER;
  data: AerialManeuverDataSourceData;
}

/** A union for data sources of all Item types */
export type WvItemDataSource =
  | AerialManeuverDataSource
  | EffectDataSource
  | MarkDataSource
  | PastDataSource
  | PerkDataSource
  | QuirkDataSource
  | SchematicDataSource
  | SpellDataSource
  | TraitDataSource
  | WeaponDataSource;

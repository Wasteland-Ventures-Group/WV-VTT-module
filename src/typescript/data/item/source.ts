import { TYPES } from "../../constants.js";
import BaseItem from "./baseItem.js";
import type EffectDataSource from "./effect/source.js";
import type WeaponDataSource from "./weapon/source.js";

class PastDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.PAST;
  }
}

interface PastDataSource {
  type: typeof TYPES.ITEM.PAST;
  data: PastDataSourceData;
}

class QuirkDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.QUIRK;
  }
}

interface QuirkDataSource {
  type: typeof TYPES.ITEM.QUIRK;
  data: QuirkDataSourceData;
}

class TraitDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.TRAIT;
  }
}

interface TraitDataSource {
  type: typeof TYPES.ITEM.TRAIT;
  data: TraitDataSourceData;
}

class PerkDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.PERK;
  }
}

interface PerkDataSource {
  type: typeof TYPES.ITEM.PERK;
  data: PerkDataSourceData;
}

class SpellDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.SPELL;
  }
}

interface SpellDataSource {
  type: typeof TYPES.ITEM.SPELL;
  data: SpellDataSourceData;
}

class MarkDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.MARK;
  }
}

interface MarkDataSource {
  type: typeof TYPES.ITEM.MARK;
  data: MarkDataSourceData;
}

class SchematicDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.SCHEMATIC;
  }
}

interface SchematicDataSource {
  type: typeof TYPES.ITEM.SCHEMATIC;
  data: SchematicDataSourceData;
}

class AerialManeuverDataSourceData extends BaseItem {
  override getTypeName(): string {
    return TYPES.ITEM.AERIAL_MANEUVER;
  }
}

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

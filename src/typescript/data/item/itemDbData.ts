import type { TemplateDocumentType } from "../common.js";
import { TYPES } from "../../constants.js";
import { DbRules } from "./rules.js";
import PhysicalItem from "./mixins/physicalItem.js";

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

export class EffectDataSourceData implements TemplateDocumentType {
  /** The rules of the Effect. */
  rules = new DbRules();

  /** @override */
  getTypeName(): string {
    return TYPES.ITEM.EFFECT;
  }
}

/** The Wasteland Ventures arbitrary effect data source */
interface EffectDataSource {
  type: typeof TYPES.ITEM.EFFECT;
  data: EffectDataSourceData;
}

export const ItemDataSourceData = PhysicalItem(
  class ItemDataSourceDataBase implements TemplateDocumentType {
    /** The rules of the Item */
    rules = new DbRules();

    /** @override */
    getTypeName(): string {
      return TYPES.ITEM.ITEM;
    }
  }
);

/** The Wasteland Ventures item data source */
interface ItemDataSource {
  type: typeof TYPES.ITEM.ITEM;
  data: typeof ItemDataSourceData;
}

/** A union for data sources of all Item types */
export type WvItemDataSource =
  | PastDataSource
  | QuirkDataSource
  | TraitDataSource
  | PerkDataSource
  | SpellDataSource
  | MarkDataSource
  | SchematicDataSource
  | AerialManeuverDataSource
  | EffectDataSource
  | ItemDataSource;

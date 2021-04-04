interface PastDbData {}
interface PastItemDbData extends Item.Data<PastDbData> {
  type: 'past';
}

interface QuirkDbData {}
interface QuirkItemDbData extends Item.Data<QuirkDbData> {
  type: 'quirk';
}

interface TraitDbData {}
interface TraitItemDbData extends Item.Data<TraitDbData> {
  type: 'trait';
}

interface PerkDbData {}
interface PerkItemDbData extends Item.Data<PerkDbData> {
  type: 'perk';
}

interface SpellDbData {}
interface SpellItemDbData extends Item.Data<SpellDbData> {
  type: 'spell';
}

interface MarkDbData {}
interface MarkItemDbData extends Item.Data<MarkDbData> {
  type: 'mark';
}

interface SchematicDbData {}
interface SchematicItemDbData extends Item.Data<SchematicDbData> {
  type: 'schematic';
}

interface AerialManeuverDbData {}
interface AerialManeuverItemDbData extends Item.Data<AerialManeuverDbData> {
  type: 'aerialManeuver';
}

interface ItemDbData {}
interface ItemItemDbData extends Item.Data<ItemDbData> {
  type: 'item';
}

export type WvItemDbData =
  | PastItemDbData
  | QuirkItemDbData
  | TraitItemDbData
  | PerkItemDbData
  | SpellItemDbData
  | MarkItemDbData
  | SchematicItemDbData
  | AerialManeuverItemDbData
  | ItemItemDbData;

import { SkillName, SpecialName, TYPES } from "./constants.js";
import { isSkillName, isSpecialName } from "./constants.js";
import type ApparelDataProperties from "./data/item/apparel/properties.js";
import type MiscDataProperties from "./data/item/misc/properties.js";
import type WeaponDataProperties from "./data/item/weapon/properties.js";
import type WvItem from "./item/wvItem.js";

/** An interface for the common properties of system drag data */
export default interface DragData extends Record<string, unknown> {
  /** The type of the drag data */
  type: string;
}

/** The drag data of an Actor SPECIAL */
export interface SpecialDragData extends DragData {
  /** The ID of the Actor, the SPECIAL belongs to */
  actorId: string;

  /** The name of the SPECIAL on the Actor */
  specialName: SpecialName;

  type: "special";
}

/**
 * A custom typeguard, to check whether an unknown object is a SpecialDragData.
 */
export function isSpecialDragData(
  data: Record<string, unknown>
): data is SpecialDragData {
  return (
    data.type === "special" &&
    typeof data.actorId === "string" &&
    typeof data.specialName === "string" &&
    isSpecialName(data.specialName)
  );
}

/** The drag data of an Actor Skill */
export interface SkillDragData extends DragData {
  /** The ID of the Actor, the Skill belongs to */
  actorId: string;

  /** The name of the Skill on the Actor */
  skillName: SkillName;

  type: "skill";
}

/**
 * A custom typeguard, to check whether an unknown object is a SkillDragData.
 */
export function isSkillDragData(
  data: Record<string, unknown>
): data is SkillDragData {
  return (
    data.type === "skill" &&
    typeof data.actorId === "string" &&
    typeof data.skillName === "string" &&
    isSkillName(data.skillName)
  );
}

export interface ItemDragData extends DragData {
  type: "Item";
  data: WvItem["data"];
}

/**
 * A custom typeguard, to check whether an unknown object is an ItemDragData.
 */
export function isItemDragData(
  data: Record<string, unknown>
): data is ItemDragData {
  return (
    data.type === "Item" &&
    typeof data.data === "object" &&
    data.data !== null &&
    "type" in data.data
  );
}

/**
 * A custom typeguard, to check whether an unknown object is an ItemDragData of
 * an apparel item.
 */
export function isApparelItemDragData(
  data: Record<string, unknown>
): data is ItemDragData & { data: ApparelDataProperties } {
  if (isItemDragData(data)) {
    return data.data.type === TYPES.ITEM.APPAREL;
  }

  return false;
}

/**
 * A custom typeguard, to check whether an unknown object is an ItemDragData of
 * a miscellaneous item.
 */
export function isMiscItemDragData(
  data: Record<string, unknown>
): data is ItemDragData & { data: MiscDataProperties } {
  if (isItemDragData(data)) {
    return data.data.type === TYPES.ITEM.MISC;
  }

  return false;
}

/**
 * A custom typeguard, to check whether an unknown object is an ItemDragData of
 * a weapon item.
 */
export function isWeaponItemDragData(
  data: Record<string, unknown>
): data is ItemDragData & { data: WeaponDataProperties } {
  if (isItemDragData(data)) {
    return data.data.type === TYPES.ITEM.WEAPON;
  }

  return false;
}

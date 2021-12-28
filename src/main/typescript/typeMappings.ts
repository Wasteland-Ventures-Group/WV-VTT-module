import { TYPES } from "./constants.js";
import Effect from "./item/effect.js";
import Weapon from "./item/weapon.js";

/** Mappings of foundry document types to class constructors. */
export const TYPE_CONSTRUCTORS = {
  /** A mapping of foundry actor types to class constructors. */
  ACTOR: {},
  /** A mapping of foundry item types to class constructors. */
  ITEM: {
    [TYPES.ITEM.EFFECT]: Effect,
    [TYPES.ITEM.WEAPON]: Weapon
  }
} as const;

/**
 * A custom typeguard to check whether a string is a mapped type identifier.
 * @param type - the type name to check
 * @returns whether the type name is mapped
 */
export function isMappedItemType(
  type: string
): type is keyof typeof TYPE_CONSTRUCTORS.ITEM {
  return Object.keys(TYPE_CONSTRUCTORS.ITEM).includes(type);
}

/**
 * A custom typeguard to check whether an Item is of the type, mapped from the
 * type name.
 * @param item - the item to check
 * @param type - the type name to check
 * @returns whether the Item is of the mapped type
 */
export function isOfItemType<T extends keyof typeof TYPE_CONSTRUCTORS.ITEM>(
  item: Item,
  type: T
): item is InstanceType<typeof TYPE_CONSTRUCTORS.ITEM[T]> {
  return item instanceof TYPE_CONSTRUCTORS.ITEM[type];
}

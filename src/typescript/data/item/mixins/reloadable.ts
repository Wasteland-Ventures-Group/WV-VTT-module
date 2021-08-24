import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the Reloadable interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Reloadable<TBase extends AnyConstructor>(Base: TBase) {
  return class ReloadableMixin extends Base implements Reloadable {
    reload = {
      ap: 0,
      caliber: undefined,
      size: 0,
      type: undefined
    } as Reloadable["reload"];
  };
}

/** This holds the base values that all reloadable items have in common. */
export interface Reloadable {
  /** Values related to reloading this item's ammo */
  reload: {
    /** The amount of action points needed to reload */
    ap: number;

    /** The weapon caliber, used by the item */
    caliber: unknown; // TODO: implement some sort of enum or type

    /** The amount of ammo that fits into the item's ammo container */
    size: number;

    /** The ammon container type of the item */
    type: unknown; // TODO: implement some sort of enum or type
  };
}

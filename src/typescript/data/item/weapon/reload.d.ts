/** A type specifying the way a weapon is reloaded */
export type Reload = Ammo | "self";

interface Ammo {
  /** The amount of action points needed to reload */
  ap: number;

  /** The caliber, used by the weapon */
  caliber: unknown; // TODO: maybe make caliber a different item type?

  /** The ammon container type of the weapon */
  containerType: AmmoContainer;

  /** The amount of ammo that fits into the weapon's ammo container */
  size: number;
}

/** A type for ammo containers */
type AmmoContainer = "internal" | "magazine";

import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the Weapon interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Weapon<TBase extends AnyConstructor>(Base: TBase) {
  return class WeaponMixin extends Base implements Weapon {
    attack = {
      damage: {
        base: 0,
        die: 0
      },
      dtReduction: 0,
      splash: undefined,
      ap: 0
    } as Weapon["attack"];
  };
}

/** This holds the base values that all weapon items have in common. */
export interface Weapon {
  /** Values related to attacking with this item */
  attack: {
    /** The values related to the damage the weapon causes */
    damage: {
      /** The base damage amount */
      base: number;

      /** The number of d6 to throw for variable damage */
      die: number;
    };

    /** The damage threshold reduction of the attack */
    dtReduction: number;

    /** The splash radius */
    splash: unknown; // TODO: implement an enum or similar

    /** The amount of action points needed to attack */
    ap: number;
  };
}

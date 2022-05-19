import type { SkillName } from "../../../../constants.js";
import type { ModifiableNumber } from "../../../common.js";

/** Derived skill values */
export default class Skills
  implements Partial<Record<SkillName, ModifiableNumber>>
{
  /** The barter skill value of an Actor */
  barter?: ModifiableNumber;

  /** The diplomacy skill value of an Actor */
  diplomacy?: ModifiableNumber;

  /** The explosives skill value of an Actor */
  explosives?: ModifiableNumber;

  /** The firearms skill value of an Actor */
  firearms?: ModifiableNumber;

  /** The intimidation skill value of an Actor */
  intimidation?: ModifiableNumber;

  /** The lockpick skill value of an Actor */
  lockpick?: ModifiableNumber;

  /** The magical energy weapons skill value of an Actor */
  magicalEnergyWeapons?: ModifiableNumber;

  /** The mechanics skill value of an Actor */
  mechanics?: ModifiableNumber;

  /** The medicine skill value of an Actor */
  medicine?: ModifiableNumber;

  /** The melee skill value of an Actor */
  melee?: ModifiableNumber;

  /** The science skill value of an Actor */
  science?: ModifiableNumber;

  /** The sleight skill value of an Actor */
  sleight?: ModifiableNumber;

  /** The sneak skill value of an Actor */
  sneak?: ModifiableNumber;

  /** The survival skill value of an Actor */
  survival?: ModifiableNumber;

  /** The thaumaturgy skill value of an Actor */
  thaumaturgy?: ModifiableNumber;

  /** The unarmed skill value of an Actor */
  unarmed?: ModifiableNumber;
}

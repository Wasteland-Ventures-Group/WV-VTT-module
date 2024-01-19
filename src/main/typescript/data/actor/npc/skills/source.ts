import type { SkillName } from "../../../../constants";
import { CompositeNumber } from "../../../common";

export default class SkillsSource
  implements Record<SkillName, CompositeNumber>
{
  barter = new CompositeNumber();

  diplomacy = new CompositeNumber();

  explosives = new CompositeNumber();

  firearms = new CompositeNumber();

  intimidation = new CompositeNumber();

  lockpick = new CompositeNumber();

  magicalEnergyWeapons = new CompositeNumber();

  mechanics = new CompositeNumber();

  medicine = new CompositeNumber();

  melee = new CompositeNumber();

  science = new CompositeNumber();

  sleight = new CompositeNumber();

  sneak = new CompositeNumber();

  survival = new CompositeNumber();

  thaumaturgy = new CompositeNumber();

  unarmed = new CompositeNumber();
}

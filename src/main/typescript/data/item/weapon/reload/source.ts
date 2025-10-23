import { Calibers } from "../../../../constants.js";
import { CompositeNumberField } from "../../../common.js";
import fields = foundry.data.fields

export type AmmoContainerType = (typeof AmmoContainerTypes)[number];
const AmmoContainerTypes = ["internal", "magazine"] as const;

export const RELOAD_SCHEMA = {
  /** The amount of action points needed to reload */
  ap: CompositeNumberField.create({ min: 0, initial: 1 }),
  /** The caliber, used by the weapon */
  caliber: new fields.StringField({ choices: Calibers, required: true, initial: "308cal" }),
  /** The ammo container type of the weapon */
  containerType: new fields.StringField({ required: true, choices: AmmoContainerTypes, initial: "magazine" }),
  /** The amount of ammo that fits into the weapon's ammo container */
  size: CompositeNumberField.create({min: 0, initial: 0}),
}

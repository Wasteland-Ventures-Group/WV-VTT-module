import { Calibers, } from "../../../constants.js";
import { PHYS_ITEM_SCHEMA } from "../common/physicalItem/source.js";
import fields = foundry.data.fields;

export const AMMO_SCHEMA = {
  /** The sub type of the ammo */
  type: new fields.StringField(),
  /** The caliber of the ammo */
  caliber: new fields.StringField({ required: false, initial: "308cal", nullable: false, choices: Calibers }),
  ...PHYS_ITEM_SCHEMA,
}

export type AmmoSource = fields.SchemaField.InitializedData<typeof AMMO_SCHEMA>;

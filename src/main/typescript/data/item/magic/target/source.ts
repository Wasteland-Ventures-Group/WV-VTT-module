import {
  SplashSizes,
  TargetTypes
} from "../../../../constants.js";
import {
  CompositeNumberField
} from "../../../common.js";

import fields = foundry.data.fields;

const AOETypes = ["none", "fixed", "varies"] as const;

export const TARGET_SCHEMA = {
  /** What the spell targets */
  type: new fields.StringField({ required: true, choices: TargetTypes, initial: "none" }),
  /** If the spell targets an AoE, what kind? */
  aoeType: new fields.StringField({ required: false, choices: AOETypes }),
  /** If the spell targets a fixed AoE, how large is it? */
  fixedAoE: new fields.StringField({ required: false, choices: SplashSizes }),
  /** If the spell target creatures/objects… how many? */
  count: CompositeNumberField.create({ min: 0, initial: 1, }),
}

import { z } from "zod";
import { Calibers } from "../../../../constants.js";
import { COMPOSITE_NUMBER_SOURCE_SCHEMA, zObject } from "../../../common.js";

export type ReloadSource = z.infer<typeof RELOAD_SCHEMA>;
export type AmmoContainerType = typeof AmmoContainerTypes[number];
const AmmoContainerTypes = ["internal", "magazine"] as const;

/** The schema containing information about reload attributes */
export const RELOAD_SCHEMA = zObject({
  /** The amount of action points needed to reload */
  ap: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({}),

  /** The caliber, used by the weapon */
  caliber: z.enum(Calibers).default("308cal"),

  /** The ammo container type of the weapon */
  containerType: z.enum(AmmoContainerTypes).default("magazine"),

  /** The amount of ammo that fits into the weapon's ammo container */
  size: COMPOSITE_NUMBER_SOURCE_SCHEMA.default({})
});

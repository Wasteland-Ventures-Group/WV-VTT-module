import { z } from "zod";
import { Calibers, TYPES } from "../../../constants.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { STACK_ITEM_SOURCE_SCHEMA } from "../common/stackableItem/source.js";

export default interface AmmoDataSource {
  type: typeof TYPES.ITEM.AMMO;
  data: AmmoDataSourceData;
}

export type AmmoDataSourceData = z.infer<typeof AMMO_SOURCE_SCHEMA>;
export const AMMO_SOURCE_SCHEMA = STACK_ITEM_SOURCE_SCHEMA.extend({
  /** The caliber of the ammo */
  caliber: z.enum(Calibers).default("308cal"),
  /** The sub type of the ammo */
  type: z.string().default("")
});

export interface CompendiumAmmo
  extends FoundryCompendiumData<AmmoDataSourceData> {
  type: typeof TYPES.ITEM.AMMO;
}

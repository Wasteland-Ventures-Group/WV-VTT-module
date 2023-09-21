import { z } from "zod";
import { Calibers, TYPES } from "../../../constants.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { STACK_ITEM_SOURCE_SCHEMA } from "../common/stackableItem/source.js";

export default interface AmmoDataSource {
  type: typeof TYPES.ITEM.AMMO;
  data: AmmoDataSourceData;
}

export type AmmoDataSourceData = z.infer<typeof AMMO_SOURCE_SCHEMA>;
export const AMMO_SOURCE_SCHEMA = STACK_ITEM_SOURCE_SCHEMA.extend({
  /** The caliber of the ammo */
  caliber: z
    .enum(Calibers)
    .default("308cal")
    .describe("The caliber of the ammo"),
  /** The sub type of the ammo */
  type: z.string().default("").describe("The sub type of the ammo")
}).default({});

export const COMP_AMMO_SCHEMA = compDataZodSchema(
  AMMO_SOURCE_SCHEMA,
  "ammo",
  "icons/weapons/ammunition/bullets-cartridge-shell-gray.webp",
  "New Ammo"
);

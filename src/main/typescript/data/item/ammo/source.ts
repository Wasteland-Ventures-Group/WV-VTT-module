import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Calibers, TYPES } from "../../../constants.js";
import { compDataZodSchema } from "../../foundryCommon.js";
import { STACK_ITEM_SCHEMA } from "../common/stackableItem/source.js";

export default interface AmmoDataSource {
  type: typeof TYPES.ITEM.AMMO;
  data: AmmoDataSourceData;
}

export type AmmoDataSourceData = z.infer<typeof AMMO_SCHEMA>;
export const AMMO_SCHEMA = STACK_ITEM_SCHEMA.extend({
  /** The caliber of the ammo */
  caliber: z
    .enum(Calibers)
    .default("308cal")
    .describe("The caliber of the ammo"),
  /** The sub type of the ammo */
  type: z.string().default("").describe("The sub type of the ammo")
});

export const AMMO_JSON_SCHEMA = zodToJsonSchema(AMMO_SCHEMA);
export const COMP_AMMO_SCHEMA = compDataZodSchema(
  AMMO_SCHEMA,
  "ammo",
  "icons/weapons/ammunition/bullets-cartridge-shell-gray.webp",
  "New Ammo"
);
export const COMP_AMMO_JSON_SCHEMA = zodToJsonSchema(COMP_AMMO_SCHEMA);

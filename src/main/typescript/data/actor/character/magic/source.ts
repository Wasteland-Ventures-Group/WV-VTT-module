import { z } from "zod";
import {
  defaultMagicSpecial,
  GeneralMagicSchools,
  SpecialNames,
  ThaumaturgySpecial,
  ThaumaturgySpecials
} from "../../../../constants.js";
import { fullRecordWithVal } from "../../../common.js";

const THAUM_SPECIAL = z.custom<ThaumaturgySpecial>((val) =>
  ThaumaturgySpecials.includes(val as ThaumaturgySpecial)
);

export const MAGIC_SCHEMA = z.object({
  /** The SPECIAL of the character associated with the Thaumaturgy skill */
  thaumSpecial: THAUM_SPECIAL.default("intelligence"),

  /**
   * Stores which SPECIAL is used to compute the potency of spells from each
   * magic school.
   */
  magicSpecials: fullRecordWithVal(
    GeneralMagicSchools,
    z.enum(SpecialNames)
  ).default(defaultMagicSpecial())
});

export type MagicSource = z.infer<typeof MAGIC_SCHEMA>;

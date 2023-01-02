import { z } from "zod";
import { COMPOSITE_NUMBER_SCHEMA } from "../../../common.js";

export type BackgroundSource = z.infer<typeof BACKGROUND_SCHEMA>;
export const BACKGROUND_SCHEMA = z.object({
  /** The age of the character */
  age: z.string().default(""),

  /** The gender of the character */
  gender: z.string().default(""),

  /** The cutie mark description of the character */
  cutieMark: z.string().default(""),

  /** The appearance of the character */
  appearance: z.string().default(""),

  /** The background of the character */
  background: z.string().default(""),

  /** The fears of the character */
  fears: z.string().default(""),

  /** The dreams of the character */
  dreams: z.string().default(""),

  /** The karma of the character */
  karma: z
    .number()
    .default(0)
    .refine(
      (val) => val >= -100 && val <= 100,
      "Karma can only range from -100 to 100"
    ),

  /** The personality of the character */
  personality: z.string().default(""),

  /** The size of the character */
  size: COMPOSITE_NUMBER_SCHEMA.default({}),

  /** The social contacts of the character */
  socialContacts: z.string().default(""),

  /** The special talent description of the character */
  specialTalent: z.string().default(""),

  /** The virtue of the character */
  virtue: z.string().default("")
});

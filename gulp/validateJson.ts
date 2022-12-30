import { promises as fs } from "fs";
import glob from "glob-promise";
import log from "fancy-log";
import type { z, ZodError } from "zod";

export default async function validateJsonTask(): Promise<void> {
  const validationConfigs: ValidationConfig[] = [
    {
      dataGlob: "./src/main/lang/*.json",
      schema: (await import("../src/main/typescript/lang.js")).LANG_SCHEMA
    },
    {
      dataGlob: "./src/main/compendiums/item/ammo/**/*.json",
      schema: (await import("../src/main/typescript/data/item/ammo/source.js"))
        .COMP_AMMO_SCHEMA
    },
    {
      dataGlob: "./src/main/compendiums/item/apparel/**/*.json",
      schema: (
        await import("../src/main/typescript/data/item/apparel/source.js")
      ).COMP_APPAREL_SCHEMA
    },
    {
      dataGlob: "./src/main/compendiums/item/magic/**/*.json",
      schema: (await import("../src/main/typescript/data/item/magic/source.js"))
        .COMP_MAGIC_SCHEMA
    },
    {
      dataGlob: "./src/main/compendiums/item/race/**/*.json",
      schema: (await import("../src/main/typescript/data/item/race/source.js"))
        .COMP_RACE_SCHEMA
    },
    {
      dataGlob: "./src/main/compendiums/item/weapon/**/*.json",
      schema: (
        await import("../src/main/typescript/data/item/weapon/source.js")
      ).COMP_WEAPON_SCHEMA
    }
  ];
  await Promise.all(
    validationConfigs.map((config) => {
      return validateFiles(config);
    })
  );
}
validateJsonTask.description =
  "Validate all JSON files with already existing schemas.";

async function validateFiles(config: ValidationConfig): Promise<void> {
  const fileNames = await glob(config.dataGlob);

  const results = await Promise.all(
    fileNames.map(async (fileName) => {
      const object = config.schema.safeParse(
        JSON.parse((await fs.readFile(fileName)).toString())
      );
      if (!object.success) {
        // log.error(object.error.flatten());
        const issues = object.error.issues;
        issues.forEach((issue) => {
          const logMsg = `${fileName}: ${issue.path.join(".")} - ${
            issue.message
          }`;
          log(logMsg);
          log.error(logMsg);
        });
      }
      return object.success;
    })
  );
  if (results.some((result) => result === false)) {
    return Promise.reject(new Error("One or more JSON files are invalid."));
  }
}

interface ValidationConfig {
  dataGlob: string;
  schema: z.Schema;
}

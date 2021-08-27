import { promises as fs } from "fs";
import gulp from "gulp";
import * as tsj from "ts-json-schema-generator";
import type { Config } from "ts-json-schema-generator";
import { WeaponDataSourceData } from "../src/typescript/data/item/weapon/source.js";
import { logChange } from "../gulpfile.js";

// The paths here are relative to the project root
const sourceBasePath = "./src/typescript/data";
const itemSourceBasePath = `${sourceBasePath}/item`;
const tsConfigPath = "./tsconfig-schemas.json";
const outputBasePath = "./src/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

const watchPath = "../src/typescript/data/**/*.ts";

const schemaBasePaths: SchemaConfig[] = [
  {
    fileName: "weapon",
    outputBasePath: itemOutputBasePath,
    path: `${itemSourceBasePath}/weapon/source.ts`,
    type: WeaponDataSourceData.name
  }
];

export default async function compendiumSchemasTask(): Promise<void[]> {
  return Promise.all(
    schemaBasePaths.map((config) => {
      return createSchema(
        {
          skipTypeCheck: true,
          tsconfig: tsConfigPath,
          ...config
        },
        config.outputBasePath,
        config.fileName
      );
    })
  );
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

export function compendiumSchemasWatchTask(): void {
  gulp.watch(watchPath, compendiumSchemasTask).on("change", logChange);
}
compendiumSchemasWatchTask.description =
  "Watch the data files and run the compSchemas task on change";

async function createSchema(
  config: Config,
  outputBasePath: string,
  fileName: string
): Promise<void> {
  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(
    `${outputBasePath}/${fileName}.json`,
    JSON.stringify(tsj.createGenerator(config).createSchema(config.type))
  );
}

interface SchemaConfig {
  fileName: string;
  outputBasePath: string;
  path: string;
  type: string;
}

import fs from "fs";
import * as tsj from "ts-json-schema-generator";
import type { Config } from "ts-json-schema-generator";
import { WeaponDataSourceData } from "../src/typescript/data/item/weapon/source.js";

// The paths here are relative to the project root
const sourceBasePath = "./src/typescript/data";
const itemSourceBasePath = `${sourceBasePath}/item`;
const tsConfigPath = "./tsconfig-schemas.json";
const outputBasePath = "./src/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

const schemaBasePaths: SchemaConfig[] = [
  {
    fileName: "weapon",
    outputBasePath: itemOutputBasePath,
    path: `${itemSourceBasePath}/weapon/source.ts`,
    type: WeaponDataSourceData.name
  }
];

export default function compendiumSchemasTask(cb: () => void): void {
  schemaBasePaths.forEach((config) => {
    createSchema(
      {
        skipTypeCheck: true,
        tsconfig: tsConfigPath,
        ...config
      },
      config.outputBasePath,
      config.fileName
    );
  });

  cb();
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

function createSchema(
  config: Config,
  outputBasePath: string,
  fileName: string
): void {
  const schema = tsj.createGenerator(config).createSchema(config.type);
  fs.mkdir(outputBasePath, { recursive: true }, () => {
    fs.writeFileSync(
      `${outputBasePath}/${fileName}.json`,
      JSON.stringify(schema, null, 2)
    );
  });
}

interface SchemaConfig {
  fileName: string;
  outputBasePath: string;
  path: string;
  type: string;
}

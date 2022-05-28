import { promises as fs } from "fs";
import { COMP_AMMO_JSON_SCHEMA } from "../src/main/typescript/data/item/ammo/source.js";
import { COMP_MAGIC_JSON_SCHEMA } from "../src/main/typescript/data/item/magic/source.js";
import { COMP_APPAREL_JSON_SCHEMA } from "../src/main/typescript/data/item/apparel/source.js";
import { COMP_WEAPON_JSON_SCHEMA } from "../src/main/typescript/data/item/weapon/source.js";

// The paths here are relative to the project root
const outputBasePath = "./src/main/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

const schemaConfigs: SchemaConfig[] = [
  {
    fileName: "ammo",
    outputBasePath: itemOutputBasePath,
    schema: COMP_AMMO_JSON_SCHEMA
  },
  {
    fileName: "magic",
    outputBasePath: itemOutputBasePath,
    schema: COMP_MAGIC_JSON_SCHEMA
  },
  {
    fileName: "apparel",
    outputBasePath: itemOutputBasePath,
    schema: COMP_APPAREL_JSON_SCHEMA
  },
  {
    fileName: "weapon",
    outputBasePath: itemOutputBasePath,
    schema: COMP_WEAPON_JSON_SCHEMA
  }
];

export default async function compendiumSchemasTask(): Promise<void[]> {
  return Promise.all(schemaConfigs.map((config) => createSchema(config)));
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

async function createSchema(config: SchemaConfig): Promise<void> {
  await fs.mkdir(config.outputBasePath, { recursive: true });
  return fs.writeFile(
    `${config.outputBasePath}/${config.fileName}.json`,
    JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      ...config.schema
    })
  );
}

interface SchemaConfig {
  fileName: string;
  outputBasePath: string;
  schema: Record<string, unknown>;
}

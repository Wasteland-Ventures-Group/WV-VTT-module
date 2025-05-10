import { promises as fs } from "fs";

// The paths here are relative to the project root
const outputBasePath = "./src/main/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

/**
 * @returns {Promise<void[]>}
 */
export default async function compendiumSchemasTask() {
  /**
   * @type {SchemaConfig[]}
   */
  const schemaConfigs = [
    {
      fileName: "ammo",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/ammo/source.js"))
        .COMP_AMMO_JSON_SCHEMA
    },
    {
      fileName: "apparel",
      outputBasePath: itemOutputBasePath,
      schema: (
        await import("../src/main/typescript/data/item/apparel/source.js")
      ).COMP_APPAREL_JSON_SCHEMA
    },
    {
      fileName: "magic",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/magic/source.js"))
        .COMP_MAGIC_JSON_SCHEMA
    },
    {
      fileName: "race",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/race/source.js"))
        .COMP_RACE_JSON_SCHEMA
    },
    {
      fileName: "weapon",
      outputBasePath: itemOutputBasePath,
      schema: (
        await import("../src/main/typescript/data/item/weapon/source.js")
      ).COMP_WEAPON_JSON_SCHEMA
    }
  ];
  return Promise.all(schemaConfigs.map((config) => createSchema(config)));
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

/**
 * @param {SchemaConfig} config
 * @returns {Promise<void>}
 */
async function createSchema(config) {
  await fs.mkdir(config.outputBasePath, { recursive: true });
  return fs.writeFile(
    `${config.outputBasePath}/${config.fileName}.json`,
    JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      ...config.schema
    })
  );
}

/**
 * @typedef {Object} SchemaConfig
 * @property {string} fileName
 * @property {string} outputBasePath
 * @property {Record<string, unknown>} schema
 */

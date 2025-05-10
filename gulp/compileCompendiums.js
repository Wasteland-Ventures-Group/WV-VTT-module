import { promises as fs } from "fs";
import { glob } from "glob";
import gulp from "gulp";
import path from "path";
import { logChange } from "../gulpfile.js";

const inputBasePath = "./src/main/compendiums";
const itemInputBasePath = `${inputBasePath}/item`;
const outputBasePath = "./dist/wasteland-ventures/compendiums";
const itemOutputBasePath = `${outputBasePath}/item`;

const watchPath = `${inputBasePath}/**/*.json`;

/**
 * @type {CompendiumConfig[]}
 */
const compendiumConfigs = [
  {
    inputGlob: `${itemInputBasePath}/ammo/*.json`,
    outputPath: `${itemOutputBasePath}/ammo.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/accessories/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/accessories.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/clothing/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/clothing.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/heavy_armor/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/heavy_armor.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/light_armor/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/light_armor.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/power_armor/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/power_armor.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/premium_armor/*.json`,
    outputPath: `${itemOutputBasePath}/apparel/premium_armor.db`
  },
  {
    inputGlob: `${itemInputBasePath}/magic/*.json`,
    outputPath: `${itemOutputBasePath}/magic.db`
  },
  {
    inputGlob: `${itemInputBasePath}/race/core/*.json`,
    outputPath: `${itemOutputBasePath}/race/core.db`
  },
  {
    inputGlob: `${itemInputBasePath}/race/wanderer/*.json`,
    outputPath: `${itemOutputBasePath}/race/wanderer.db`
  },
  {
    inputGlob: `${itemInputBasePath}/weapon/*.json`,
    outputPath: `${itemOutputBasePath}/weapons.db`
  }
];

/**
 * @returns {Promise<void[]>}
 */
export default async function compileCompendiumsTask() {
  return Promise.all(
    compendiumConfigs.map((config) => {
      return compileCompendium(config);
    })
  );
}
compileCompendiumsTask.description =
  "Compile all single entry files to compemdiums.";

/**
 * @returns {void}
 */
export function compileCompendiumsWatchTask() {
  gulp.watch(watchPath, compileCompendiumsTask).on("change", logChange);
}
compileCompendiumsWatchTask.description =
  "Watch the compendium input files for changes and trigger the compile task.";

/**
 * @param {CompendiumConfig} config
 * @returns {Promise<void>}
 */
async function compileCompendium(config) {
  const fileNames = await glob(config.inputGlob, { dot: true });
  /**
   * @type {IdTracker}
   */
  const ids = {};

  const contents = await Promise.all(
    fileNames.map(async (fileName) => {
      const entry = JSON.parse((await fs.readFile(fileName)).toString());

      if (ids[entry["_id"]]) {
        ids[entry["_id"]]?.push(fileName);
      } else {
        ids[entry["_id"]] = [fileName];
      }

      return JSON.stringify(entry);
    })
  );

  const duplicates = Object.entries(ids).filter((entry) => entry[1].length > 1);
  if (duplicates.length) {
    let errorMessage = `There were duplicate IDs in compendium "${config.outputPath}".`;

    for (const [key, value] of duplicates) {
      errorMessage += `\n${key} in ${value.join(", ")}`;
    }

    return Promise.reject(new Error(errorMessage));
  }

  await fs.mkdir(path.dirname(config.outputPath), { recursive: true });

  return fs.writeFile(config.outputPath, contents.join("\n"));
}

/**
 * @typedef {Record<string, string[]>} IdTracker
 */

/**
 * @typedef {Object} CompendiumConfig
 * @property {string} inputGlob
 * @property {string} outputPath
 */

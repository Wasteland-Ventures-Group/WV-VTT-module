import { promises as fs } from "fs";
import glob from "glob-promise";
import gulp from "gulp";
import { logChange } from "../gulpfile.js";

const inputBasePath = "./src/main/compendiums";
const itemInputBasePath = `${inputBasePath}/item`;
const outputBasePath = "./dist/wasteland-ventures/compendiums";
const itemOutputBasePath = `${outputBasePath}/item`;

const watchPath = `${inputBasePath}/**/*.json`;

const compendiumConfigs: CompendiumConfig[] = [
  {
    inputGlob: `${itemInputBasePath}/ammo/*.json`,
    outputPath: `${itemOutputBasePath}/ammo.db`
  },
  {
    inputGlob: `${itemInputBasePath}/apparel/*.json`,
    outputPath: `${itemOutputBasePath}/apparel.db`
  },
  {
    inputGlob: `${itemInputBasePath}/magic/*.json`,
    outputPath: `${itemOutputBasePath}/magic.db`
  },
  {
    inputGlob: `${itemInputBasePath}/race_core/*.json`,
    outputPath: `${itemOutputBasePath}/race_core.db`
  },
  {
    inputGlob: `${itemInputBasePath}/weapon/*.json`,
    outputPath: `${itemOutputBasePath}/weapons.db`
  }
];

export default async function compileCompendiumsTask(): Promise<void[]> {
  await Promise.all([fs.mkdir(itemOutputBasePath, { recursive: true })]);

  return Promise.all(
    compendiumConfigs.map((config) => {
      return compileCompendium(config);
    })
  );
}
compileCompendiumsTask.description =
  "Compile all single entry files to compemdiums.";

export function compileCompendiumsWatchTask(): void {
  gulp.watch(watchPath, compileCompendiumsTask).on("change", logChange);
}
compileCompendiumsWatchTask.description =
  "Watch the compendium input files for changes and trigger the compile task.";

async function compileCompendium(config: CompendiumConfig): Promise<void> {
  const fileNames = await glob(config.inputGlob, { dot: true });
  const ids: IdTracker = {};

  const contents = await Promise.all(
    fileNames.map(async (fileName) => {
      const entry = JSON.parse((await fs.readFile(fileName)).toString());

      if (ids[entry["_id"]]) {
        ids[entry["_id"]].push(fileName);
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

  return fs.writeFile(config.outputPath, contents.join("\n"));
}

type IdTracker = Record<string, string[]>;

interface CompendiumConfig {
  inputGlob: string;
  outputPath: string;
}

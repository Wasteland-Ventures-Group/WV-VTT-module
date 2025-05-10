import { promises as fs } from "fs";
import gulp from "gulp";
import zip from "gulp-zip";
import { distPrefix, distWvPrefix, systemId } from "../gulpfile.js";

/**
 * @returns {Promise<NodeJS.ReadWriteStream>}
 */
export default async function distZipTask() {
  return gulp
    .src(`${distPrefix}/**`)
    .pipe(zip(`${systemId}-${await getVersionNumber()}.zip`))
    .pipe(gulp.dest(distPrefix));
}
distZipTask.description = "Zip the distribution files";

/**
 * @returns {Promise<string>}
 */
async function getVersionNumber() {
  /**
   * @type {string}
   */
  let systemJson;
  try {
    await fs.access(`${distWvPrefix}/system.json`);
    systemJson = `${distWvPrefix}/system.json`;
  } catch {
    systemJson = "./src/main/system.json";
  }
  return JSON.parse((await fs.readFile(systemJson)).toString())["version"];
}

import * as log from "fancy-log";
import { src, dest, parallel, watch } from "gulp";
import * as dartSass from "gulp-dart-sass";
import * as typescript from "gulp-typescript";

// = Path constants ============================================================

// The file name patterns have to be written as explicit globs, to get the
// underlying chokidar library to put watches on the directory of the files and
// not on the inodes of the files directly. Doing so would brake for editors
// with atomic write (like Vim) and only trigger on the first change.
// See: https://github.com/gulpjs/gulp/issues/1322

const handlebarsPath = "./src/handlebars/**/*.hbs";
const handlebarsOutPath = "./dist/handlebars";

const langPath = "./src/lang/*.json";
const langOutPath = "./dist/lang";

const sassPath = "./src/sass/**/*.sass";
const cssOutPath = "./dist/css";

const tsProject = typescript.createProject("tsconfig.json");
const jsOutPath = "./dist/modules";

const systemPath = "./src/system.json";
const systemWatchPath = "./src/[s-s]ystem.json";
const systemOutPath = "./dist";

const templatePath = "./src/template.json";
const templateWatchPath = "./src/[t-t]emplate.json";
const templateOutPath = "./dist";

// = Handlebars copy ===========================================================

export function hbs(): NodeJS.ReadWriteStream {
  return src(handlebarsPath).pipe(dest(handlebarsOutPath));
}
hbs.description = "Copy all handlebars files";

export function hbsWatch(): void {
  watch(handlebarsPath, hbs).on("change", logChange);
}
hbsWatch.description =
  "Watch the Handlebars input files for changes and copy them";

// = Lang tasks ================================================================

export function lang(): NodeJS.ReadWriteStream {
  return src(langPath).pipe(dest(langOutPath));
}
lang.description = "Copy all language files";

export function langWatch(): void {
  watch(langPath, lang).on("change", logChange);
}
langWatch.description = "Watch the language files for changes and copy them";

// = Sass tasks ================================================================

export function sass(): NodeJS.ReadWriteStream {
  return src(sassPath)
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(dest(cssOutPath));
}
sass.description = "Compile all Sass files into CSS";

export function sassWatch(): void {
  watch(sassPath, sass).on("change", logChange);
}
sassWatch.description =
  "Watch the Sass input files for changes and run the compile task";

// = Typescript tasks ==========================================================

export function ts(): NodeJS.ReadWriteStream {
  return tsProject.src().pipe(tsProject()).js.pipe(dest(jsOutPath));
}
ts.description = "Compile all Typescript files to Javascript";

export function tsWatch(): void {
  const includes = tsProject.config.include;
  includes && watch(includes).on("change", logChange);
}
tsWatch.description =
  "Watch the Typescript input files for changes and run the compile task";

// = system.json tasks =========================================================

export function system(): NodeJS.ReadWriteStream {
  return src(systemPath).pipe(dest(systemOutPath));
}
system.description = "Copy the system.json file";

export function systemWatch(): void {
  watch(systemWatchPath, system).on("change", logChange);
}
systemWatch.description = "Watch system.json for changes and copy it";

// = template.json tasks =======================================================

export function template(): NodeJS.ReadWriteStream {
  return src(templatePath).pipe(dest(templateOutPath));
}
template.description = "Copy the template.json file";

export function templateWatch(): void {
  watch(templateWatchPath, template).on("change", logChange);
}
templateWatch.description = "Watch template.json for changes and copy it";

// = General tasks =============================================================

export const pack = parallel(hbs, lang, sass, ts, system, template);
pack.description = "Copy and compile all relevant files to the dist dir";

export const watchAll = parallel(
  hbsWatch,
  langWatch,
  sassWatch,
  tsWatch,
  systemWatch,
  templateWatch
);
watchAll.description = "Run all watch tasks";

// = Common functions ==========================================================

function logChange(path: string) {
  log(`${path} change`);
}

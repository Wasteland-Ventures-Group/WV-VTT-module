import dartSass from "gulp-dart-sass";
import del from "del";
import * as esbuild from "esbuild";
import gulp from "gulp";
import log from "fancy-log";
import typescript from "gulp-typescript";
import { CONSTANTS } from "./src/main/typescript/constants.js";
import distZipTask from "./gulp/distZip.js";
import templateTask from "./gulp/template.js";
import compendiumSchemasTask from "./gulp/compendiumSchemas.js";
import compileCompendiumsTask, {
  compileCompendiumsWatchTask
} from "./gulp/compileCompendiums.js";
import validateJsonTask from "./gulp/validateJson.js";
import langSchemaTask from "./gulp/langSchema.js";

// = Path constants ============================================================

// The file name patterns have to be written as explicit globs, to get the
// underlying chokidar library to put watches on the directory of the files and
// not on the inodes of the files directly. Doing so would brake for editors
// with atomic write (like Vim) and only trigger on the first change.
// See: https://github.com/gulpjs/gulp/issues/1322

export const distPrefix = "./dist";
export const distWvPrefix = `${distPrefix}/${CONSTANTS.systemId}`;

const handlebarsPath = "./src/main/handlebars/**/*.hbs";
const handlebarsOutPath = `${distWvPrefix}/handlebars`;

const langPath = "./src/main/lang/*.json";
const langOutPath = `${distWvPrefix}/lang`;

const sassRoot = `./src/main/sass/${CONSTANTS.systemId}.sass`;
const sassPath = "./src/main/sass/**/*.s{a,c}ss";
const cssOutPath = `${distWvPrefix}/css`;

const tsProjectPath = "./src/main/typescript/tsconfig.json";
const tsProject = typescript.createProject(tsProjectPath);
const tsEntryPoint = "./src/main/typescript/wastelandVentures.ts";
const tsPath = "./src/main/typescript/**/*.ts";
const jsOutPath = `${distWvPrefix}/modules`;
const jsOutFile = `${jsOutPath}/wastelandVentures.js`;

const systemPath = "./src/main/system.json";
const systemWatchPath = "./src/main/[s-s]ystem.json";
const systemOutPath = distWvPrefix;

export const templateOutPath = `${distWvPrefix}/template.json`;

// = Handlebars copy ===========================================================

export function hbs(): NodeJS.ReadWriteStream {
  return gulp.src(handlebarsPath).pipe(gulp.dest(handlebarsOutPath));
}
hbs.description = "Copy all handlebars files.";

export function hbsWatch(): void {
  gulp
    .watch(handlebarsPath, { ignoreInitial: false }, hbs)
    .on("change", logChange);
}
hbsWatch.description =
  "Watch the Handlebars input files for changes and copy them.";

// = Lang tasks ================================================================

export function lang(): NodeJS.ReadWriteStream {
  return gulp.src(langPath).pipe(gulp.dest(langOutPath));
}
lang.description = "Copy all language files.";

export function langWatch(): void {
  gulp.watch(langPath, { ignoreInitial: false }, lang).on("change", logChange);
}
langWatch.description = "Watch the language files for changes and copy them.";

// = Sass tasks ================================================================

export function sass(): NodeJS.ReadWriteStream {
  return gulp
    .src(sassRoot)
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(gulp.dest(cssOutPath));
}
sass.description = "Compile all Sass files into CSS.";

export function sassWatch(): void {
  gulp.watch(sassPath, { ignoreInitial: false }, sass).on("change", logChange);
}
sassWatch.description =
  "Watch the Sass input files for changes and run the compile task.";

// = Typescript tasks ==========================================================

export function typecheck() {
  return tsProject.src().pipe(tsProject());
}
typecheck.description = "Typecheck the typescript sources.";

let tsBuildResult: esbuild.BuildResult | null = null;
async function esBuild({
  incremental = false,
  prod = false
} = {}): Promise<esbuild.BuildResult> {
  if (incremental && tsBuildResult?.rebuild) {
    tsBuildResult = await tsBuildResult.rebuild();
  } else {
    tsBuildResult = await esbuild.build({
      bundle: true,
      entryPoints: [tsEntryPoint],
      format: "esm",
      incremental: incremental,
      keepNames: true,
      legalComments: "none",
      minify: prod,
      outfile: jsOutFile,
      sourcemap: true,
      sourceRoot: `systems/${CONSTANTS.systemId}`,
      treeShaking: prod
    });
  }
  return tsBuildResult;
}

export function bundleTs() {
  return esBuild();
}
bundleTs.description = "Bundle the typescript sources for development.";

export function bundleTsProd() {
  return esBuild({ prod: true });
}
bundleTsProd.description = "Bundle the typescript sources for production.";

export const ts = gulp.series(typecheck, bundleTs);
ts.description =
  "Type check and bundle the typescript sources for development.";

export const tsProd = gulp.series(typecheck, bundleTsProd);
tsProd.description =
  "Type check and bundle the typescript sources for production.";

export function tsWatch(): void {
  const bundleTs = () => esBuild({ incremental: true });
  gulp
    .watch(tsPath, { ignoreInitial: false }, bundleTs)
    .on("change", logChange);
}
tsWatch.description =
  "Watch the Typescript input files for changes and run the ts task.";

// = system.json tasks =========================================================

export function system(): NodeJS.ReadWriteStream {
  return gulp.src(systemPath).pipe(gulp.dest(systemOutPath));
}
system.description = "Copy the system.json file.";

export function systemWatch(): void {
  gulp
    .watch(systemWatchPath, { ignoreInitial: false }, system)
    .on("change", logChange);
}
systemWatch.description = "Watch system.json for changes and copy it.";

// = template.json tasks =======================================================

export const template = templateTask;

// = schema tasks ==============================================================

export const compSchemas = compendiumSchemasTask;
export const langSchema = langSchemaTask;
export const validateJson = gulp.series(
  gulp.parallel(compSchemas, langSchema),
  validateJsonTask
);
validateJson.description = "Validate all JSON files.";

// = compendiums compile tasks =================================================

export const compileComps = compileCompendiumsTask;
export const compileCompsWatch = compileCompendiumsWatchTask;

// = General tasks =============================================================

export const pack = gulp.parallel(
  compileComps,
  hbs,
  lang,
  sass,
  system,
  ts,
  template
);
pack.description = "Copy and compile all relevant files to the dist dir.";

export const watchAll = gulp.parallel(
  compileCompsWatch,
  hbsWatch,
  langWatch,
  sassWatch,
  tsWatch,
  systemWatch
);
watchAll.description = "Run all watch tasks.";

export function clean(): Promise<string[]> {
  return del(`${distPrefix}/**`, { force: true });
}
clean.description = "Clean the dist dir.";

// = Distribution tasks ========================================================

export const distZip = distZipTask;

export const buildZip = gulp.series(
  clean,
  gulp.parallel(compileComps, hbs, lang, sass, system, tsProd, template),
  distZip
);
buildZip.description = "Clean, Pack and zip the distribution files.";

// = Common functions ==========================================================

export function logChange(path: string): void {
  log(`${path} changed`);
}
logChange.description = "This is just a utility function and not a task.";

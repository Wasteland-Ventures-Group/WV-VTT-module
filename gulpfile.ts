import del from "del";
import log from "fancy-log";
import fs from "fs";
import gulp from "gulp";
import dartSass from "gulp-dart-sass";
import typescript from "gulp-typescript";
import zip from "gulp-zip";

import type { TemplateDocumentType } from "./src/typescript/data/common.js";

// = Path constants ============================================================

// The file name patterns have to be written as explicit globs, to get the
// underlying chokidar library to put watches on the directory of the files and
// not on the inodes of the files directly. Doing so would brake for editors
// with atomic write (like Vim) and only trigger on the first change.
// See: https://github.com/gulpjs/gulp/issues/1322

const distPrefix = "./dist";
const distWvPrefix = `${distPrefix}/wasteland-ventures`;

const handlebarsPath = "./src/handlebars/**/*.hbs";
const handlebarsOutPath = `${distWvPrefix}/handlebars`;

const langPath = "./src/lang/*.json";
const langOutPath = `${distWvPrefix}/lang`;

const sassRoot = "./src/sass/wasteland-ventures.sass";
const sassPath = "./src/sass/**/*.sass";
const cssOutPath = `${distWvPrefix}/css`;

const tsProject = typescript.createProject("tsconfig.json");
const jsOutPath = `${distWvPrefix}/modules`;

const systemPath = "./src/system.json";
const systemWatchPath = "./src/[s-s]ystem.json";
const systemOutPath = distWvPrefix;

const templateOutPath = `${distWvPrefix}/template.json`;

// = Handlebars copy ===========================================================

export function hbs(): NodeJS.ReadWriteStream {
  return gulp.src(handlebarsPath).pipe(gulp.dest(handlebarsOutPath));
}
hbs.description = "Copy all handlebars files";

export function hbsWatch(): void {
  gulp.watch(handlebarsPath, hbs).on("change", logChange);
}
hbsWatch.description =
  "Watch the Handlebars input files for changes and copy them";

// = Lang tasks ================================================================

export function lang(): NodeJS.ReadWriteStream {
  return gulp.src(langPath).pipe(gulp.dest(langOutPath));
}
lang.description = "Copy all language files";

export function langWatch(): void {
  gulp.watch(langPath, lang).on("change", logChange);
}
langWatch.description = "Watch the language files for changes and copy them";

// = Sass tasks ================================================================

export function sass(): NodeJS.ReadWriteStream {
  return gulp
    .src(sassRoot)
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(gulp.dest(cssOutPath));
}
sass.description = "Compile all Sass files into CSS";

export function sassWatch(): void {
  gulp.watch(sassPath, sass).on("change", logChange);
}
sassWatch.description =
  "Watch the Sass input files for changes and run the compile task";

// = Typescript tasks ==========================================================

export function ts(): NodeJS.ReadWriteStream {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(jsOutPath));
}
ts.description = "Compile all Typescript files to Javascript";

export function tsWatch(): void {
  const includes = tsProject.config.include;
  includes && gulp.watch(includes, ts).on("change", logChange);
}
tsWatch.description =
  "Watch the Typescript input files for changes and run the compile task";

// = system.json tasks =========================================================

export function system(): NodeJS.ReadWriteStream {
  return gulp.src(systemPath).pipe(gulp.dest(systemOutPath));
}
system.description = "Copy the system.json file";

export function systemWatch(): void {
  gulp.watch(systemWatchPath, system).on("change", logChange);
}
systemWatch.description = "Watch system.json for changes and copy it";

// = template.json tasks =======================================================

export function template(cb: fs.NoParamCallback): void {
  // We somehow have to get TS to reimport the files each time. Currently they
  // are only loaded the first time and then cached.
  Promise.all([
    import("./src/typescript/data/actor/actorDbData.js"),
    import("./src/typescript/data/item/itemDbData.js")
  ])
    .then(([actorDbData, itemDbData]) => {
      const actorDocumentTypes = [
        new actorDbData.PlayerCharacterDataSourceData()
      ];
      const itemDocumentTypes = [
        new itemDbData.EffectDataSourceData(),
        new itemDbData.ItemDataSourceData()
      ];
      fs.mkdir(distWvPrefix, { recursive: true }, () => {
        fs.writeFile(
          templateOutPath,
          JSON.stringify(
            createTemplateObject(actorDocumentTypes, itemDocumentTypes)
          ),
          cb
        );
      });
    })
    .catch((reason) => log(`template generation failed: ${reason}`));
}
template.description = "Generate the template.json file";

// = General tasks =============================================================

export const pack = gulp.parallel(hbs, lang, sass, ts, system, template);
pack.description = "Copy and compile all relevant files to the dist dir";

export const watchAll = gulp.parallel(
  hbsWatch,
  langWatch,
  sassWatch,
  tsWatch,
  systemWatch
);
watchAll.description = "Run all watch tasks";

export function clean(): Promise<string[]> {
  return del(`${distPrefix}/**`, { force: true });
}
clean.description = "Clean the dist dir";

// = Distribution tasks ========================================================

export function distZip(): NodeJS.ReadWriteStream {
  return gulp
    .src(`${distPrefix}/**`)
    .pipe(zip(`wasteland-ventures-${getVersionNumber()}.zip`))
    .pipe(gulp.dest(distPrefix));
}
distZip.description = "Zip the distribution files";

export const buildZip = gulp.series(pack, distZip);
buildZip.description = "Pack and zip the distribution files";

// = Common functions ==========================================================

function logChange(path: string) {
  log(`${path} changed`);
}

function getVersionNumber(): string {
  let systemJson: string;
  if (fs.existsSync(`${distWvPrefix}/system.json`)) {
    systemJson = `${distWvPrefix}/system.json`;
  } else {
    systemJson = "./src/system.json";
  }
  return JSON.parse(fs.readFileSync(systemJson).toString())["version"];
}

interface DocumentTemplates extends Record<string, unknown> {
  types: string[];
}

interface Template {
  Actor: DocumentTemplates;
  Item: DocumentTemplates;
}

function createTemplateObject(
  actorDocumentTypes: TemplateDocumentType[],
  itemDocumentTypes: TemplateDocumentType[]
) {
  const template: Template = {
    Actor: {
      types: []
    },
    Item: {
      types: []
    }
  };
  actorDocumentTypes.forEach((actorDocumentType) => {
    template.Actor.types.push(actorDocumentType.getTypeName());
    template.Actor[actorDocumentType.getTypeName()] = actorDocumentType;
  });
  itemDocumentTypes.forEach((itemDocumentType) => {
    template.Item.types.push(itemDocumentType.getTypeName());
    template.Item[itemDocumentType.getTypeName()] = itemDocumentType;
  });
  return template;
}

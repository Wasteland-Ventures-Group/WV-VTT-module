import * as log from "fancy-log";
import * as fs from "fs";
import { src, dest, parallel, watch } from "gulp";
import * as dartSass from "gulp-dart-sass";
import * as typescript from "gulp-typescript";

import { TemplateEntityType } from "./src/typescript/data/common";

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

const templateWatchBasePath = "./src/typescript/data";
const templateWatchPaths = [
  `${templateWatchBasePath}/[c-c]ommon.ts`,
  `${templateWatchBasePath}/actorDbData.ts`,
  `${templateWatchBasePath}/itemDbData.ts`
];
const templateOutPath = "./dist/template.json";

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

export function template(cb: fs.NoParamCallback): void {
  // We somehow have to get TS to reimport the files each time. Currently they
  // are only loaded the first time and then cached.
  Promise.all([
    import("./src/typescript/data/actorDbData"),
    import("./src/typescript/data/itemDbData")
  ])
    .then(([actorDbData, itemDbData]) => {
      const actorEntityTypes = [new actorDbData.WvActorDbDataData()];
      const itemEntityTypes = [new itemDbData.ItemDbData()];
      fs.writeFile(
        templateOutPath,
        JSON.stringify(createTemplateObject(actorEntityTypes, itemEntityTypes)),
        cb
      );
    })
    .catch((reason) => log(`template generation failed: ${reason}`));
}
template.description = "Generate the template.json file";

export function templateWatch(): void {
  watch(templateWatchPaths, template).on("change", logChange);
}
templateWatch.description =
  "Watch the template.json input files for changes and generate it";

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

interface EntitiesTemplates extends Record<string, unknown> {
  types: string[];
}

interface Template {
  Actor: EntitiesTemplates;
  Item: EntitiesTemplates;
}

function createTemplateObject(
  actorEntityTypes: TemplateEntityType[],
  itemEntityTypes: TemplateEntityType[]
) {
  const template: Template = {
    Actor: {
      types: []
    },
    Item: {
      types: []
    }
  };
  actorEntityTypes.forEach((actorEntityType) => {
    template.Actor.types.push(actorEntityType.getTypeName());
    template.Actor[actorEntityType.getTypeName()] = actorEntityType;
  });
  itemEntityTypes.forEach((itemEntityType) => {
    template.Item.types.push(itemEntityType.getTypeName());
    template.Item[itemEntityType.getTypeName()] = itemEntityType;
  });
  return template;
}

const log = require('fancy-log')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const hbs = require('gulp-hbs')
const header = require('gulp-header')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

// = Handlebars tasks ==========================================================

const cssLinkBasePath = '../../../dist/css'
const htmlOutPath = './test/out/html'
const i18nBasePath = './dist/lang'
const i18nEnPath = `${i18nBasePath}/en.json`
const mockBasePath = './test/mock'
const handlebarsBasePath = './dist/handlebars'

const htmlHeader =
`<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <title>Character Sheet</title>
  <link rel="stylesheet" href="${cssLinkBasePath}/common.css">
  <link rel="stylesheet" href="${cssLinkBasePath}/actors/character-sheet.css">
</head>
`

// This construct with the enData could cause concurrency problems, if the
// localization file is changed a lot in a short time, but should not be a
// problem in practice.
let enData
hbs.registerHelper('localize', (key) => {
  return enData[key]
})

function parseI18nFile (cb) {
  fs.readFile(i18nEnPath, 'utf-8', (err, data) => {
    if (err) {
      log(`Could not read ${i18nEnPath}: ${err}`)
      cb(err)
    } else {
      enData = JSON.parse(data)
      cb()
    }
  })
}
parseI18nFile.description = `Parse the i18n file ${i18nEnPath}`

const compileCharacterSheet =
  series(parseI18nFile, function compileHbsCharacterSheet () {
    return src(`${mockBasePath}/character.json`)
      .pipe(hbs(src(`${handlebarsBasePath}/actors/character-sheet.hbs`)))
      .pipe(header(htmlHeader))
      .pipe(dest(htmlOutPath))
  })
compileCharacterSheet.description =
  'Compile the character sheet Handlebars template'

const compileHandlebars = parallel(compileCharacterSheet)
compileHandlebars.description = 'Compile all Handlerbars templates'

function watchHbsCharacterSheet () {
  // The file name patterns have to be written as explicit globs, to get the
  // underlying chokidar library to put watches on the directory of the files
  // and not on the inodes of the files directly. Doing so would brake for
  // editors with atomic write (like Vim) and only trigger on the first change.
  // See: https://github.com/gulpjs/gulp/issues/1322
  const watcher = watch(
    [`${i18nBasePath}/[e-e]n.json`,
      `${mockBasePath}/[c-c]haracter.json`,
      `${handlebarsBasePath}/actors/[c-c]haracter-sheet.hbs`],
    compileCharacterSheet)

  watcher.on('change', (path) => {
    log(`${path} changed`)
  })
}
watchHbsCharacterSheet.description =
  'Watch the input files for the character sheet Handlebars template for changes and run the compile task'

const watchHandlebars = parallel(watchHbsCharacterSheet)
watchHandlebars.description = 'Run all watch tasks for the Handlebars templates'

// = Sass tasks ================================================================

const cssOutPath = './dist/css'
const sassPath = './src/sass/**/*.sass'

function compileSass () {
  return src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(cssOutPath))
}
compileSass.description = 'Compile all Sass files into CSS'

function watchSass () {
  const watcher = watch(sassPath, compileSass)

  watcher.on('change', (path) => {
    log(`${path} changed`)
  })
}
watchSass.description =
  'Watch the input files for the Sass task for changes and run the compile task'

// = Typescript tasks ==========================================================

const jsOutPath = './dist/modules'

function compileTypescript () {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(dest(jsOutPath))
}
compileTypescript.description = 'Compile the Typescript to Javascript'

function watchTypescript () {
  const watcher = watch(tsProject.src())

  watcher.on('change', (path) => {
    log(`${path} changed`)
  })
}
watchTypescript.description =
  'Watch the Typescript input files for changes and run the compile task'

// = General tasks =============================================================

const watchAll = parallel(watchHandlebars, watchSass, watchTypescript)
watchAll.description = 'Run all watch tasks'

// = Task exports ==============================================================

exports.hbs = compileHandlebars
exports['hbs:char'] = compileCharacterSheet
exports['hbs:char:watch'] = watchHbsCharacterSheet
exports['hbs:watch'] = watchHandlebars
exports.sass = compileSass
exports['sass:watch'] = watchSass
exports.ts = compileTypescript
exports['ts:watch'] = watchTypescript
exports.default = watchAll

const log = require('fancy-log')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const hbs = require('gulp-hbs')
const header = require('gulp-header')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

// = Handlebars tasks ==========================================================

const htmlPath = './html'
const i18nDataPath = './lang/en.json'

const htmlHeader =
`<!DOCTYPE html>
<head>
  <title>Character Sheet</title>
  <link rel="stylesheet" href="../css/common.css">
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
  fs.readFile(i18nDataPath, 'utf-8', (err, data) => {
    if (err) {
      log(`Could not read ${i18nDataPath}: ${err}`)
      cb(err)
    } else {
      enData = JSON.parse(data)
      cb()
    }
  })
}
parseI18nFile.description = `Parse the i18n file ${i18nDataPath}`

const compileCharacterSheet =
  series(parseI18nFile, function compileHbsCharacterSheet () {
    return src('./mock/character.json')
      .pipe(hbs(src('./templates/actors/character-sheet.hbs')))
      .pipe(header(htmlHeader))
      .pipe(dest(htmlPath))
  })
compileCharacterSheet.description =
  'Compile the character sheet Handlebars template'

const compileHandlebars = parallel(compileCharacterSheet)
compileHandlebars.description = 'Compile all Handlerbars templates'

function watchHbsCharacterSheet () {
  const watcher = watch(
    ['./lang/en.json',
      './mock/character.json',
      './templates/actors/character-sheet.hbs'],
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

const cssPath = './css'
const sassPath = './sass/**/*.sass'

function compileSass () {
  return src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(cssPath))
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

// = General tasks =============================================================

const watchAll = parallel(watchHandlebars, watchSass)
watchAll.description = 'Run all watch tasks'

exports.hbs = compileHandlebars
exports['hbs:char'] = compileCharacterSheet
exports['hbs:char:watch'] = watchHbsCharacterSheet
exports['hbs:watch'] = watchHandlebars
exports.sass = compileSass
exports['sass:watch'] = watchSass
exports.default = watchAll

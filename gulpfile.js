const fs = require('fs')
const { src, dest, parallel, watch } = require('gulp')
const hbs = require('gulp-hbs')
const header = require('gulp-header')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const cssPath = './css'
const sassPath = './sass/**/*.sass'

let enData
fs.readFile('./lang/en.json', 'utf-8', (err, data) => {
  if (err) {
    console.log(`Could not read en.json: ${err}`)
  } else {
    enData = JSON.parse(data)
  }
})

hbs.registerHelper('localize', (key) => {
  return enData[key]
})

function compileHandlebars () {
  return parallel(compileHbsCharacterSheet)
}
compileHandlebars.description = 'Compile all Handlerbars templates'

function compileHbsCharacterSheet () {
  return src('./mock/character.json')
    .pipe(hbs(src('./templates/actors/character-sheet.hbs')))
    .pipe(header('<link rel="stylesheet" href="../css/common.css">\n'))
    .pipe(dest('./html'))
}
compileHbsCharacterSheet.description =
  'Compile the character sheet Handlebars template'

function compileSass () {
  return src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(cssPath))
}
compileSass.description = 'Compile all Sass files into CSS'

function watchHandlebars () {
  parallel(watchHbsCharacterSheet)
}
watchHandlebars.description = 'Run all watch tasks for the Handlebars templates'

function watchHbsCharacterSheet () {
  const watcher = watch(
    ['./lang/en.json',
      './mock/character.json',
      './templates/actors/character-sheet.hbs'],
    compileHbsCharacterSheet)
  watcher.on('change', (path) => {
    console.log(`\n${path} changed`)
  })
}
watchHbsCharacterSheet.description =
  'Watch the input files for the character sheet Handlebars template for changes and run the compile task'

function watchSass () {
  const watcher = watch(sassPath, compileSass)
  watcher.on('change', (path) => {
    console.log(`\n${path} changed`)
  })
}
watchSass.description =
  'Watch the input files for the Sass task for changes and run the compile task'

exports.hbs = compileHandlebars
exports['hbs:char'] = compileHbsCharacterSheet
exports['hbs:char:watch'] = watchHbsCharacterSheet
exports['hbs:watch'] = watchHandlebars
exports.sass = compileSass
exports['sass:watch'] = watchSass
exports.default = watchSass

/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-15 10:16:46
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-03 10:05:11
 */

'use strict'

// Gulp
const gulp = require('gulp')
// Gulp Plugins (use $.{gulpPluginName})
const $ = require('gulp-load-plugins')()

const {Base} = require('./libs')

/**
 * Build SDKs
 * @param  {function} cb Gulp callback
 */
gulp.task('sdk-build', function(cb) {
  // Create a new Base instance
  const base = new Base({
    'gulp': gulp,
    '$': $
  })

  // Start task
  base.start(cb)
})

gulp.task('sdk-list', function(cb) {
  const sdks = require('./libs/sdks')
  const sdkNames = Object.keys(sdks)

  $.util.log('')
  for (const k in sdkNames) {
    const sdkName = sdkNames[k]

    $.util.log($.util.colors.magenta('>'), sdkName)
  }
  $.util.log('')

  cb()
})

gulp.task('default', ['sdk-build'])

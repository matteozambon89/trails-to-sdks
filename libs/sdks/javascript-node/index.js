/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-18 03:50:45
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-14 01:36:09
 */

const {Path, Logger} = require('../../')
const {waterfall, parallel, eachOf} = require('async')
const mkdirp = require('mkdirp')
const arrayUniq = require('array-uniq')
const path = require('path')
const del = require('del')
const extend = require('extend')
const humps = require('humps')
const format = require('string-template')

module.exports = class JavaScriptNode {
  /**
   * JavaScriptNode class constructor
   * @param       {object} opt         Options
   * @param       {object} opt.config  SDK specific configuration
   * @param       {object} opt.logger  Logger instance
   * @param       {object} opt.spinner Spinner instance
   * @param       {object} opt.trails  Trails instance
   * @param       {object} opt.gulp    Gulp instance
   * @param       {object} opt.$       Gulp Pulgin container
   * @constructor
   */
  constructor(opt) {
    // Make all the opt.* instances available across all JavaScriptNode
    this.config = opt.config
    this.logger = opt.logger
    this.spinner = opt.spinner
    this.trails = opt.trails
    this.gulp = opt.gulp
    this.$ = opt.$

    // Internal config used just for internal stuff
    this.localConfig = require('./config')

    this.logger.log(
      'debug',
      '[JavaScriptNode].constructor:',
      Logger.colorSuccess('initialized!'),
      {
        'localConfig': this.localConfig,
        'config': this.config
      }
    )
  }

  prepare(cb) {
    // do additional preparation

    this.logger.log(
      'debug',
      '[JavaScriptNode].prepare:',
      Logger.colorInfo('preparing...')
    )

    this.spinner.start('Prepare resources for ' + this.localConfig.prj.name)

    this.config.keywordsString = JSON.stringify(this.config.keywords)
    this.config.contributorsString = JSON.stringify(this.config.contributors)

    this.config.templatesPaths = []
    for (const k in this.localConfig.templates) {
      const el = this.localConfig.templates[k]
      el.dest = path.join(this.config.dest, el.dest)


      el.src = Path.resolve(path.join('libs', 'sdks', this.localConfig.prj.id, el.src))

      this.localConfig.templates[k] = el
      this.config.templatesPaths.push(el.dest)
    }

    this.config.templatesPaths = arrayUniq(this.config.templatesPaths)

    this.spinner.succeed()

    cb()
  }

  /**
   * Task - Clean for this SDK
   * @param  {Function} cb Callback
   */
  clean(cb) {
    this.logger.log(
      'debug',
      '[JavaScriptNode].clean:',
      Logger.colorInfo('cleaning...')
    )

    this.spinner.start('Clean output dir for ' + this.localConfig.prj.name)

    waterfall([
      // Ensure destination path exists
      (nextTask) => {
        this.logger.log(
          'debug',
          '[JavaScriptNode].clean:',
          Logger.colorInfo('ensure destination exists...'),
          Logger.colorPath(this.config.dest)
        )

        mkdirp(this.config.dest, {
          'mode': '755 & (~process.umask())'
        }, nextTask)
      },
      // Delete all what's specified in the delPatter variable in config
      (paths, nextTask) => {
        this.logger.log(
          'debug',
          '[JavaScriptNode].clean:',
          Logger.colorInfo('delete with pattern...'),
          {
            'pattern': this.config.delPattern
          }
        )

        del.sync(this.config.delPattern)

        nextTask()
      },
      // Ensure templates paths exist
      (nextTask) => {
        this.logger.log(
          'debug',
          '[JavaScriptNode].clean:',
          Logger.colorInfo('ensure templates paths exist...'),
          {
            'paths': this.config.templatesPaths
          }
        )

        eachOf(this.config.templatesPaths, (path, index, nextPath) => {
          mkdirp(path, {
            'mode': '755 & (~process.umask())'
          }, nextPath)
          // ensureDir(path, nextPath)
        }, nextTask)
      },
      // Stop the spinner with success
      (nextTask) => {
        this.spinner.succeed()

        nextTask()
      }
    ], cb)
  }

  build(cb) {

    this.logger.log(
      'debug',
      '[JavaScriptNode].build:',
      Logger.colorInfo('building...')
    )

    this.spinner.start('Build ' + this.localConfig.prj.name)

    parallel([
      (next) => {
        const template = this.localConfig.templates.packageJson
        const src = template.src
        const mustacheData = this.config
        const rename = template.fileName
        const dest = template.dest

        this.logger.log(
          'debug',
          '[JavaScriptNode].build:',
          Logger.colorInfo(rename),
          {
            'src': src,
            'mustache': mustacheData,
            'rename': rename,
            'dest': dest
          }
        )

        this.gulp.src(src)
          .pipe(this.$.mustache(mustacheData))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.$.rename(rename))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.gulp.dest(dest))
          .on('error', (err) => {
            next(err)
          })
          .on('end', () => {
            this.spinner.succeed('Built ' + rename + ' for ' + this.localConfig.prj.name)

            next()
          })
      },
      (next) => {
        const template = this.localConfig.templates.baseModel
        const src = template.src
        const mustacheData = this.config
        const rename = template.fileName
        const dest = template.dest

        this.logger.log(
          'debug',
          '[JavaScriptNode].build:',
          Logger.colorInfo(rename),
          {
            'src': src,
            'mustache': mustacheData,
            'rename': rename,
            'dest': dest
          }
        )

        this.gulp.src(src)
          .pipe(this.$.mustache(mustacheData))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.$.rename(rename))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.gulp.dest(dest))
          .on('error', (err) => {
            next(err)
          })
          .on('end', () => {
            this.spinner.succeed('Built ' + rename + ' for ' + this.localConfig.prj.name)

            next()
          })
      },
      (next) => {
        const template = this.localConfig.templates.client
        const src = template.src
        const mustacheData = this.config
        const rename = template.fileName
        const dest = template.dest

        this.logger.log(
          'debug',
          '[JavaScriptNode].build:',
          Logger.colorInfo(rename),
          {
            'src': src,
            'mustache': mustacheData,
            'rename': rename,
            'dest': dest
          }
        )

        this.gulp.src(src)
          .pipe(this.$.mustache(mustacheData))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.$.rename(rename))
          .on('error', (err) => {
            next(err)
          })
          .pipe(this.gulp.dest(dest))
          .on('error', (err) => {
            next(err)
          })
          .on('end', () => {
            this.spinner.succeed('Built ' + rename + ' for ' + this.localConfig.prj.name)

            next()
          })
      },
      (next) => {
        // each model
        eachOf(this.config.models, (model, modelName, nextModel) => {
          const template = this.localConfig.templates.schema
          const src = template.src
          const mustacheData = model
          const rename = format(template.fileName, {
            'modelPrefix': humps.decamelize(this.config.prefix, {'separator': '-'}),
            'modelName': humps.decamelize(modelName, {'separator': '-'})
          })
          const dest = template.dest

          this.gulp.src(src)
            .pipe(this.$.mustache(mustacheData))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.$.rename(rename))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.gulp.dest(dest))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.$.jsbeautifier({
              'indent_size': 2,
              'end_with_newline': true
            }))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.gulp.dest(dest))
            .on('error', (err) => {
              nextModel(err)
            })
            .on('end', () => {
              this.spinner.succeed('Built ' + rename + ' for ' + this.localConfig.prj.name)

              nextModel()
            })
        }, next)
      },
      (next) => {
        // each model
        eachOf(this.config.models, (model, modelName, nextModel) => {
          const template = this.localConfig.templates.model
          const src = template.src
          const mustacheData = extend({}, model, {
            'modelPrefix': this.config.prefix,
            'modelName': humps.pascalize(modelName)
          })
          const rename = format(template.fileName, {
            'modelPrefix': humps.decamelize(this.config.prefix, {'separator': '-'}),
            'modelName': humps.decamelize(modelName, {'separator': '-'})
          })
          const dest = template.dest

          this.gulp.src(src)
            .pipe(this.$.mustache(mustacheData))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.$.rename(rename))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.gulp.dest(dest))
            .on('error', (err) => {
              nextModel(err)
            })
            .pipe(this.gulp.dest(dest))
            .on('error', (err) => {
              nextModel(err)
            })
            .on('end', () => {
              this.spinner.succeed('Built ' + rename + ' for ' + this.localConfig.prj.name)

              nextModel()
            })
        }, next)
      }
    ], (err) => {
      cb(err)
    })
  }

  test(cb) {
    // run test

    this.logger.log(
      'debug',
      '[JavaScriptNode].test:',
      Logger.colorInfo('testing...')
    )

    this.spinner.start('Test ' + this.localConfig.prj.name + ' output')

    setTimeout(() => {
      this.spinner.succeed()

      cb()
    }, 5000)
  }

  git(cb) {
    // create repo if needed
    // change branch
    // add latest changes
    // commit
    // push

    this.logger.log(
      'debug',
      '[JavaScriptNode].git:',
      Logger.colorInfo('gitting...')
    )

    this.spinner.start('Update ' + this.localConfig.prj.name + ' repository')

    setTimeout(() => {
      this.spinner.succeed()

      cb()
    }, 5000)
  }
}

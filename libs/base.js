/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-18 03:50:20
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-13 11:58:07
 */

// Config | Trails | Logger
const {Config, Trails, Logger} = require('./index')

// Async
const {waterfall, eachOfSeries, mapValues} = require('async')
// Extend
const extend = require('extend')
// Ora
const ora = require('ora')
// Path
const path = require('path')
// String Template
const format = require('string-template')


module.exports = class Base {
  /**
   * Base class constructor
   * @param       {object} opt      Options
   * @param       {object} opt.gulp Gulp instance
   * @param       {object} opt.$    Gulp Pulgin container
   * @constructor
   */
  constructor(opt) {
    // Create a new Logger intance
    this.logger = new Logger()
    // Make Gulp and it's plugins available across all Base
    this.gulp = opt.gulp
    this.$ = opt.$

    // Create a Spinner
    this.spinner = ora()
    // Create a new Trails instance (this is used for a lite interaction with Trails Application)
    this.trails = new Trails()

    this.logger.log(
      'debug',
      '[Base].constructor:',
      Logger.colorSuccess('initialized!')
    )
  }

  // -------------------------------
  // Getters

  /**
   * Get/initialize configuration
   * @return {object} Base configuration
   */
  get config () {
    if (!this._config) {
      this._config = Config.config

      this.logger.log(
        'debug',
        '[Base].config:',
        Logger.colorWarn('_config was missing so I initialized it!'),
        {
          '_config': this._config
        }
      )
    }

    return this._config
  }

  // END - Getters
  // -------------------------------

  // -------------------------------
  // Helpers

  /**
   * Abort task
   * @param  {object} opt         Options
   * @param  {Error}  opt.err     Error
   * @param  {string} opt.message Error message
   */
  abort(opt) {
    // If logger exists, then log!
    if (this.logger) {
      this.logger.log(
        'error',
        '[Base].abort:',
        Logger.colorError('aborting...'),
        {
          'opt': opt
        }
      )
    }

    // Error must be passed to callback
    // so either use an Error instance (`opt.err`)
    // or create one from `opt.message` or send message 'Aborting!'
    const err = opt.err || new Error(opt.message || 'Aborting!')
    const message = opt.message || err.message

    // If spinner exists, then fail it using Error message
    if (this.spinner) {
      this.spinner.fail(message)
    }
    // If trails exists, then stop it!
    if (this.trails) {
      this.trails.stopApp()
    }
    // If callback exists, then call it with `err`!
    if (this.cb) {
      this.cb(err)
    }
  }

  /**
   * Succeed task
   * @param  {object} opt         Options
   * @param  {string} opt.message Success message
   */
  succeed(opt) {
    // If logger exists, then log!
    if (this.logger) {
      this.logger.log(
        'debug',
        '[Base].succeed:',
        Logger.colorSuccess('succeeding...'),
        {
          'opt': opt
        }
      )
    }

    // If spinner exists, then succeed with `opt.message` or `Success!`
    if (this.spinner) {
      this.spinner.succeed(opt.message || 'Success!')
    }
    // If trails exists, then stop it!
    if (this.trails) {
      this.trails.stopApp()
    }
    // If callback exists, then call it!
    if (this.cb) {
      this.cb()
    }
  }

  /**
   * Start Trails App
   * @dependency logger
   * @dependency spinner
   * @dependency trails
   */
  startTrails() {
    this.logger.log(
      'debug',
      '[Base].startTrails'
    )

    // Start spinner with message 'Start Trails...'
    this.spinner.start('Start Trails...')

    // Start trailsApp
    this.trails.startApp()
      .then(() => {
        this.generate()
      })
      // In case of error, abort!
      .catch((e) => {
        this.abort({
          'message': 'Failed to start Trails!',
          'err': e
        })
      })
  }

  generate() {
    this.logger.log(
      'debug',
      '[Base].generate'
    )

    waterfall([
      (nextTask) => {
        this.prepare(nextTask)
      },
      (sdkConfigs, nextTask) => {
        const base = this

        // Go through each configured SDK
        eachOfSeries(sdkConfigs, this.eachSDK.bind(base), nextTask)
      },
    ], (err) => {
      if (err) {
        this.abort({
          'message': err.abortMessage || 'Error during SDK generation',
          'e': err
        })

        return
      }

      this.succeed({
        'message': 'All SDKs have been built!'
      })
    })
  }

  prepare(cb) {
    this.logger.log(
      'debug',
      '[Base].prepare'
    )

    waterfall([
      (nextPrepare) => {
        this.prepareConfig(nextPrepare)
      },
      (config, nextPrepare) => {
        this.trails.prepare(config, nextPrepare)
      },
      (config, nextPrepare) => {
        this.prepareSDKConfig(config, nextPrepare)
      }
    ], (err, result) => {
      if (err) {
        err.abortMessage = err.abortMessage || 'Error during preparation'
      }
      cb(err, result)
    })
  }

  prepareConfig(cb) {
    this.logger.log(
      'debug',
      '[Base].prepareConfig'
    )

    let config = null

    // Try load config
    try {
      /**
       * Configuration
       * @type   {object}
       * @param  {object} global Global configuration
       * @param  {object} sdks   List of configured SDKs
       */
      config = this.config
    }
    // If it fails then, abort!
    catch (err) {
      err.abortMessage = 'Failed to load the config file...'

      return cb(err)
    }

    return cb(null, config)
  }

  prepareSDKConfig(config, cb) {
    this.logger.log(
      'debug',
      '[Base].prepareSDKConfig:',
      {
        'config': config
      }
    )

    mapValues(config.sdks, (sdkConfig, sdkName, nextSDK) => {
      this.logger.log(
        'debug',
        '[Base].prepareSDKConfig:',
        Logger.colorInfo(sdkName),
        {
          'sdkName': sdkName,
          'sdkConfig': sdkConfig
        }
      )

      // Extend SDK config with global configuration
      sdkConfig = extend(true, {}, config.global, sdkConfig)

      // SDK specifig Destination
      sdkConfig.dest = path.join(sdkConfig.dest, sdkConfig.prjName)
      // Del Pattern
      sdkConfig.delPattern = [
        format('{0}/**', sdkConfig.dest),
        format('!{0}', sdkConfig.dest),
        format('!{0}/.git', sdkConfig.dest)
      ]

      nextSDK(null, sdkConfig)
    }, (err, result) => {
      if (err) {
        err.abortMessage = err.abortMessage || 'Error during SDK config preparation'
      }
      cb(err, result)
    })
  }

  /**
   * Generate each configured SDK
   * @param  {object}   sdkConfig SDK configuration
   * @param  {string}   sdkName   SDK name
   * @param  {function} cb        Go to next SDK or complete
   */
  eachSDK(sdkConfig, sdkName, cb) {
    this.logger.log(
      'debug',
      '[Base].eachSDK:',
      Logger.colorInfo(sdkName),
      {
        'sdkName': sdkName,
        'sdkConfig': sdkConfig
      }
    )

    // Require SDK class
    const SDK = require('./sdks')[sdkName]
    // Create new SDK instance
    const sdkInstance = new SDK({
      'config': sdkConfig,
      'logger': this.logger,
      'spinner': this.spinner,
      'trails': this.trails,
      'gulp': this.gulp,
      '$': this.$
    })

    waterfall([
      (nextTask) => {
        sdkInstance.prepare(nextTask)
      },
      (nextTask) => {
        sdkInstance.clean(nextTask)
      },
      (nextTask) => {
        sdkInstance.build(nextTask)
      },
      (nextTask) => {
        sdkInstance.test(nextTask)
      },
      (nextTask) => {
        sdkInstance.git(nextTask)
      }
    ], (err, result) => {
      if (err) {
        err.abortMessage = err.abortMessage || 'Error during ' + sdkName + ' generation'
      }
      cb(err, result)
    })
  }

  // END - Helpers
  // -------------------------------

  start(cb) {
    this.spinner.start('Getting ready to pack...')
    this.cb = cb

    this.trails.app.on('trails:start', (e) => {
      this.spinner.succeed('Trails started successfully!')
    })

    this.startTrails()
  }
}

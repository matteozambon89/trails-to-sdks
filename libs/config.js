/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-23 09:51:09
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-04 11:03:11
 */

// Path | Logger
const {Path, Logger} = require('./')

// Minimalist
const argv = require('minimist')(process.argv.slice(2))

// Schemas - Config
const schemaConfig = require('./schemas')('config')

module.exports = class Config {
  // -------------------------------
  // Getters

  /**
   * Get configuration path
   * @return {string} Configuration path
   * @static
   */
  static get configPath() {
    // --config '/config.json' must be passed at all time
    if (!argv || !argv.config) {
      throw new Error('Pass your config using the augument `--config \'/path/to/config.json\'`')
    }

    // Resolve path using --config value
    const configPath = Path.resolve(argv.config)

    Logger.log(
      'debug',
      '[Config].configPath:',
      Logger.colorPath(configPath)
    )

    return configPath
  }

  /**
   * Get configuration
   * @return {string} Configuration path
   * @static
   */
  static get config() {
    // Require config.json using the static `Config.configPath` method
    const config = require(Config.configPath)

    Logger.log(
      'debug',
      '[Config].config:',
      {
        'config': config
      }
    )

    // Test config using AJV
    if (!schemaConfig(config)) {
      // Throw an error passing AJV.errors
      const err = new Error('Config is invalid')
      err.validationLog = config.errors

      Logger.log(
        'error',
        '[Config].config:',
        Logger.colorError(err.message),
        {
          'validationLog': err.validationLog
        }
      )

      throw err
    }

    // Make Trails.js project path always absolute
    config.global.trailsApp = Path.resolve(config.global.trailsApp)
    Logger.log(
      'debug',
      '[Config].config.trailsApp:',
      Logger.colorPath(config.global.trailsApp)
    )

    // Make Destination path always absolute
    config.global.dest = Path.resolve(config.global.dest)
    Logger.log(
      'debug',
      '[Config].config.dest:',
      Logger.colorPath(config.global.dest)
    )

    return config
  }

  // END - Getters
  // -------------------------------
}

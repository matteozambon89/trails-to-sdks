/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-18 04:30:50
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-07 10:40:28
 */

// Minimalist
const argv = require('minimist')(process.argv.slice(2))
// Winston
const winston = require('winston')
// Chalk
const chalk = require('chalk')

module.exports = class Logger {
  /**
   * Logger class constructor
   * @return      {object}  Winston logger intance
   * @constructor
   */
  constructor() {
    // Use Winston to create a new Logger
    const logger = new winston.Logger({
      'level': Logger.logLevel,
      'exitOnError': false,
      'transports': [
        new (winston.transports.Console)({
          'prettyPrint': true,
          'colorize': true
        })
      ]
    })

    logger.log(
      'debug',
      '[Logger].constructor:',
      Logger.colorSuccess('initialized!')
    )

    return logger
  }

  // -------------------------------
  // Static Getters

  /**
   * Get log level using --log-level or default to 'warn'
   * @default 'warn'
   * @return  {string}  Log level
   * @static
   */
  static get logLevel() {
    return argv && argv['log-level'] ? argv['log-level'] : 'warn'
  }

  /**
   * Get color
   * @return {object}  Chalk
   * @static
   */
  static get color() {
    return chalk
  }

  // END - Static Getters
  // -------------------------------

  // -------------------------------
  // Static Methods

  /**
   * Get a path and color it
   * @param  {string} path Whatever path you want to color
   * @return {string}      Colored path
   * @static
   */
  static colorPath(path) {
    return Logger.color.blue(path)
  }

  /**
   * Get a message and color it for success
   * @param  {string} message Whatever message you want to color
   * @return {string}         Colored message
   * @static
   */
  static colorSuccess(message) {
    return Logger.color.green(message)
  }

  /**
   * Get a message and color it for error
   * @param  {string} message Whatever message you want to color
   * @return {string}         Colored message
   * @static
   */
  static colorError(message) {
    return Logger.color.red(message)
  }

  /**
   * Get a message and color it for warning
   * @param  {string} message Whatever message you want to color
   * @return {string}         Colored message
   * @static
   */
  static colorWarn(message) {
    return Logger.color.yellow(message)
  }

  /**
   * Get a message and color it for info
   * @param  {string} message Whatever message you want to color
   * @return {string}         Colored message
   * @static
   */
  static colorInfo(message) {
    return Logger.color.magenta(message)
  }

  /**
   * Log using static logger
   * @static
   */
  static log() {
    const logger = new Logger()

    logger.log.apply(logger, arguments)
  }

  // END - Static Methods
  // -------------------------------
}

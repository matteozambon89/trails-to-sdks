/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-18 04:30:50
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-04 11:02:22
 */

// Path
const path = require('path')

// Logger
const {Logger} = require('./')

module.exports = class Path {
  /**
   * Resolve a path with some logic more than classic path
   * @param  {string} value Path to resolve
   * @return {string}       Resolved path
   * @static
   */
  static resolve(value) {
    // Get a new logger instance since we are on
    Logger.log(
      'debug',
      '[Path].resolve:',
      Logger.colorPath(value)
    )

    // Use a new variable to don't override the entry value
    let resolvedValue = value

    // If path isn't absolute then, resolve path using `process.cwd()`
    if (!path.isAbsolute(value)) {
      Logger.log(
        'debug',
        '[Path].resolve:',
        Logger.colorPath(value),
        Logger.colorWarn('is not absolute!')
      )

      resolvedValue = path.resolve(process.cwd(), value)
    }
    else {
      Logger.log(
        'debug',
        '[Path].resolve:',
        Logger.colorPath(value),
        Logger.colorSuccess('is absolute!')
      )
    }

    Logger.log(
      'debug',
      '[Path].resolve:',
      'resolved to',
      Logger.colorPath(resolvedValue)
    )

    return resolvedValue
  }
}

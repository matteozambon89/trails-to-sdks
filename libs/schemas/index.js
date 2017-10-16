/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 02:43:18
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-22 09:18:04
 */

// ajv
const Ajv = require('ajv')
// Path
const path = require('path')
// File System
const fs = require('fs')
// SemVer
const semver = require('semver')
// Validate NPM Package License
const validateLicense = require('validate-npm-package-license')
// Validate Domain Name
const isDomainName = require('is-domain-name')
// Validate IP
const isIp = require('is-ip')


module.exports = function(name) {
  const ajv = new Ajv({
    'useDefaults': true
  })
  ajv.addFormat('hostname', (val) => {
    return isDomainName(val) || isIp(val)
  })
  ajv.addFormat('abs-path', (val) => path.isAbsolute(val))
  ajv.addFormat('dir-path', (val) => {
    if (path.isAbsolute(val)) {
      return fs.existsSync(val) && fs.lstatSync(val).isDirectory()
    }

    const resolvedVal = path.resolve(process.cwd(), val)
    if (!fs.existsSync(resolvedVal)) {
      return false
    }

    return fs.lstatSync(resolvedVal).isDirectory()
  })
  ajv.addFormat('file-path', (val) => {
    if (path.isAbsolute(val)) {
      return fs.existsSync(val)
    }

    const resolvedVal = path.resolve(process.cwd(), val)
    if (!fs.existsSync(resolvedVal)) {
      return false
    }

    return fs.lstatSync(resolvedVal).isFile()
  })
  ajv.addFormat('version', (val) => semver.valid(val))
  ajv.addFormat('license', (val) => validateLicense(val).validForNewPackages)

  return ajv.compile(require('./' + name))
}

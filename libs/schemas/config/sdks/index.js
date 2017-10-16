/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 03:51:09
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-14 12:26:55
 */

'use strict'

// File System
const fs = require('fs')
// Path
const path = require('path')
// Extend
const extend = require('extend')

const sdks = {
  'type': 'object',
  'properties': {},
  'additionalProperties': false,
  'anyOf': []
}

fs.readdirSync(__dirname)
  .map(file => file.replace(/\.js$/, ''))
  .forEach(sdk => {
    if (sdk === 'index') {
      return
    }

    // Get SDK Schema
    const sdkSchema = require(path.join(__dirname, sdk))

    // Global's properties
    const global = extend(true, {}, require('../global'))
    for (const k in global.properties) {
      sdkSchema.properties[k] = global.properties[k]
      delete sdkSchema.properties[k].default
    }
    // Remove unwanted global's properties
    delete sdkSchema.properties.trailsApp
    delete sdkSchema.properties.dest

    // prjName
    sdkSchema.properties.prjName.default = sdk
    sdkSchema.required.push('prjName')

    // repository
    sdkSchema.properties.repository = require('../repository')
    sdkSchema.required.push('repository')

    // Add SDK Schema to SDK list
    sdks.properties[sdk] = sdkSchema
    // Add SDK name to the Any Of requirements
    sdks.anyOf.push({'required': [sdk]})
  })

module.exports = sdks

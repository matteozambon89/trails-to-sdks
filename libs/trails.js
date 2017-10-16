/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-18 03:50:27
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-05 12:01:51
 */

//  Config | Logger
const {Config, Logger} = require('./')
// TrailsApp
const TrailsApp = require('trails')
// FileSystem
const fs = require('fs')
// Extend
const extend = require('extend')
// Parallel
const {parallel, mapValues} = require('async')
// Humps
const humps = require('humps')

module.exports = class Trails {
  /**
   * Trails class constructor
   * @constructor
   */
  constructor() {
    // Create a new Logger intance
    this.logger = new Logger()

    // Trails.js project to be parsed
    this._trailsApp = require(this.trailsPath)

    // Let's launch the Trails.js project App
    this._app = new TrailsApp(this._trailsApp)
    // App's log level will be the same of Logger
    this._app.log.level = Logger.logLevel

    this.logger.log(
      'debug',
      '[Trails].constructor:',
      Logger.colorSuccess('initialized!')
    )
  }

  // -------------------------------
  // Getters

  /**
   * Get Trails.js project path
   * @return {string} Trails.js project path
   */
  get trailsPath() {
    // Get configuration
    const config = Config.config
    // `.global.trailsApp` is the Trails.js project path
    const trailsApp = config.global.trailsApp

    // If missing or path doesn't exist then, fail throw an error
    if (!trailsApp || !fs.existsSync(trailsApp)){
      this.logger.log(
        'error',
        '[Trails].trailsPath:',
        Logger.colorError('Trails.js project path is invalid...'),
        {
          'trailsApp': trailsApp,
          'exists': trailsApp ? fs.existsSync(trailsApp) : false
        }
      )
      throw new Error('Trails path invalid')
    }

    this.logger.log(
      'debug',
      '[Trails].trailsPath:',
      Logger.colorPath(trailsApp)
    )

    return trailsApp
  }

  /**
   * Return Trails.js project app
   * @return {object} Trails.js project app
   */
  get app() {
    return this._app
  }

  // END - Getters
  // -------------------------------

  // -------------------------------
  // Public Methods

  /**
   * Start Trails.js app for project
   * @return {Promise} Start Trails.js app promise
   */
  startApp() {
    this.logger.log(
      'debug',
      '[Trails].startApp:',
      Logger.colorInfo('starting...')
    )

    // Start app and store promise
    const promise = this.app.start()

    // Log using promise
    promise
      .then(() => {
        this.logger.log(
          'info',
          '[Trails].startApp:',
          Logger.colorSuccess('started!')
        )
      })
      .catch((err) => {
        this.logger.log(
          'error',
          '[Trails].startApp:',
          Logger.colorError('error!'),
          {
            'err': err
          }
        )
      })

    return promise
  }

  /**
   * Stop Trails.js app for project
   * @return {Promise} Stop Trails.js app promise
   */
  stopApp() {
    this.logger.log(
      'debug',
      '[Trails].stopApp:',
      Logger.colorInfo('stopping...')
    )

    // Stop app and store promise
    const promise = this.app.stop()

    // Log using promise
    promise
      .then(() => {
        this.logger.log(
          'info',
          '[Trails].stopApp:',
          Logger.colorSuccess('stopped!')
        )
      })
      .catch((err) => {
        this.logger.log(
          'error',
          '[Trails].stopApp:',
          Logger.colorError('error!'),
          {
            'err': err
          }
        )
      })

    return promise
  }

  /**
   * Prepare using Trails.js app
   */
  prepare(config, cb) {
    this.logger.log(
      'debug',
      '[Trails].prepare:',
      {
        'config': config
      }
    )

    const trails = this

    parallel({
      // config.global.api
      'api': (nextTask) => {
        trails.prepareFootprint(nextTask)
      },
      // config.global.routes
      'routes': (nextTask) => {
        trails.prepareRoutes(nextTask)
      },
      // config.global.models
      'models': (nextTask) => {
        trails.prepareModels(nextTask)
      },
    }, (err, result) => {
      if (err) {
        err.abortMessage = err.abortMessage || 'Error during Trails preparation'

        return cb(err)
      }

      // Result is extention of config.global
      cb(null, extend(true, {}, config, {
        'global': result
      }))
    })
  }

  prepareFootprint(cb) {
    this.logger.log(
      'debug',
      '[Trails].prepareFootprint'
    )

    const api = {}

    const app = this.app
    const appConfig = app.config
    const footprints = appConfig.footprints

    // API pathname is Footprint Prefix
    api.pathname = footprints.prefix

    cb(null, api)
  }

  prepareRoutes(cb) {
    this.logger.log(
      'debug',
      '[Trails].prepareRoutes'
    )

    const routes = []

    const app = this.app
    const appConfig = app.config
    const appRoutes = appConfig.routes

    for (const k in appRoutes) {
      const appRoute = appRoutes[k]

      if (appRoute.handler === 'AuthController.callback') {
        continue
      }

      const route = {}
      route.path = appRoute.path
      route.method = appRoute.method
      route.name = appRoute.handler

      // Turn 'Footprint' into 'Model'
      route.name = route.name.replace(/Footprint/, 'Model')
      // Remove 'Controller'
      route.name = route.name.replace(/Controller/, '')
      // Make name decamelized
      route.name = route.name.replace(/\./, '-')
      // Camelize name
      route.name = humps.camelize(route.name)

      // In case method is '*' means route accepts all methods
      if (route.method === '*') {
        route.method = [
          'GET',
          'POST',
          'PUT',
          'PATCH',
          'HEAD',
          'DELETE'
        ]
      }

      // In case route accepts more than one method,
      // create more than one route
      if (Array.isArray(route.method)) {
        for (const m in route.method) {
          const method = route.method[m]

          // Create new instance of route
          const methodRoute = extend({}, route)

          // Route method is one of the accepted method
          methodRoute.method = method

          // Route name is now prefixed by method and decamelized
          methodRoute.name = [method.toLowerCase(), methodRoute.name].join('-')
          // Camelize name
          methodRoute.name = humps.camelize(methodRoute.name)

          routes.push(methodRoute)
        }
      }
      else {
        routes.push(route)
      }
    }

    cb(null, routes)
  }

  prepareModels(cb) {
    this.logger.log(
      'debug',
      '[Trails].prepareModels'
    )

    const trails = this

    const app = trails.app
    const api = app.api
    const models = api.models

    if (app.packs.mongoose) {
      mapValues(models, trails.prepareMongooseModel.bind(trails), cb)
    }
    else {
      throw new Error('ORM isn\'t defined')
    }
  }

  prepareMongooseModel(trailsModel, modelName, cb) {
    this.logger.log(
      'debug',
      '[Trails].prepareMongooseModel:',
      Logger.colorInfo(modelName),
      {
        'trailsModel': trailsModel,
        'modelName': modelName
      }
    )

    const modelConfig = trailsModel.config()
    const modelSchema = trailsModel.schema()

    if (!modelSchema && !modelConfig) {
      return cb(null, {})
    }
    else if (!modelSchema) {
      return cb(null, {})
    }
    else if (modelConfig && modelConfig.private) {
      return cb(null, {})
    }

    const model = {}

    model.modelName = modelName
    model.required = []
    model.properties = {}

    if (modelConfig.schema && modelConfig.schema.timestamps) {
      // TODO: customize this using `modelConfig.schema.timestamps` as object

      // Default createdAt
      model.properties.createdAt = {
        'name': 'createdAt',
        'typeString': true,
        'format': 'date-time'
      }
      // Default updatedAt
      model.properties.updatedAt = {
        'name': 'updatedAt',
        'typeString': true,
        'format': 'date-time'
      }
    }

    mapValues(modelSchema, (property, propertyName, nextProperty) => {
      const propertyType = property.type.name

      const modelProperty = {}

      modelProperty.name = propertyName

      if (property.required) {
        model.required.push(propertyName)
      }

      modelProperty['type' + propertyType] = true

      nextProperty(null, modelProperty)
    }, (err, result) => {
      if (err) {
        err.abortMessage = 'Error during ' + modelName + ' model preparation'
      }

      model.properties = extend(true, {}, model.properties, result)
      model.properties = Object.values(model.properties)

      cb(err, model)
    })
  }

  // END - Public Methods
  // -------------------------------

  // -------------------------------
  // Prepare Models - Mongoose

  // END - Prepare Models - Mongoose
  // -------------------------------

  // -------------------------------
  // Prepare Models



  // END - Prepare Models
  // -------------------------------
}

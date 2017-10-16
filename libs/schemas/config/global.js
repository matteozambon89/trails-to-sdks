/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 02:40:55
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-23 09:32:21
 */

module.exports = {
  'type': 'object',
  'properties': {
    'trailsApp': {
      'type': 'string',
      'format': 'dir-path'
    },
    'dest': {
      'type': 'string',
      'format': 'dir-path',
      'default': './output'
    },
    'prefix': {
      'type': 'string',
      'default': 'Trails',
      'minimum': 1,
      'maximum': 10
    },
    'prjName': {
      'type': 'string',
      'default': 'trails-sdk'
    },
    'version': {
      'type': 'string',
      'format': 'version',
      'default': '1.0.0'
    },
    'description': {
      'type': 'string',
      'default': ''
    },
    'homepage': {
      'type': 'string',
      'format': 'url'
    },
    'bugs': require('./bugs'),
    'license': {
      'type': 'string',
      'format': 'license',
      'default': 'MIT'
    },
    'author': require('./person'),
    'keywords': {
      'type': 'array',
      'items': {
        'type': 'string'
      },
      'default': ['trails', 'sdk']
    },
    'contributors': {
      'type': 'array',
      'items': require('./person'),
      'default': []
    },
    'api': require('./api'),
    'routes': {
      'type': 'array',
      'items': require('./routes'),
      'default': []
    }
  },
  'additionalProperties': false,
  'required': [
    'trailsApp',
    'dest',
    'prefix',
    'prjName',
    'version',
    'description',
    'license',
    'keywords',
    'contributors',
    'api',
    'routes'
  ]
}

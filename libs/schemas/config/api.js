/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 06:27:05
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-19 07:09:45
 */

module.exports = {
  'type': 'object',
  'properties': {
    'protocol': {
      'type': 'string',
      'enum': [
        'http',
        'https'
      ],
      'default': 'http'
    },
    'port': {
      'type': 'number',
      'minimum': 1,
      'maximum': 65535
    },
    'auth': {
      'type': 'string'
    },
    'hostname': {
      'type': 'string',
      'format': 'hostname'
    },
    'pathname': {
      'type': 'string',
      'format': 'abs-path'
    },
    'query': {
      'type': 'object',
      'anyOf': [
        {
          'patternProperties': {
            '^.*$': {
              'type': 'string'
            }
          }
        },
        {
          'patternProperties': {
            '^.*$': {
              'type': 'number'
            }
          }
        },
        {
          'patternProperties': {
            '^.*$': {
              'type': 'boolean'
            }
          }
        }
      ],
      'additionalProperties': false
    }
  },
  'additionalProperties': false,
  'required': [
    'protocol',
    'hostname'
  ]
}

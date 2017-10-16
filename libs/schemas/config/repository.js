/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 06:27:05
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-14 12:23:18
 */

module.exports = {
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string',
      'default': 'git'
    },
    'url': {
      'type': 'string',
      'format': 'url'
    }
  },
  'additionalProperties': false,
  'required': [
    'type',
    'url'
  ]
}

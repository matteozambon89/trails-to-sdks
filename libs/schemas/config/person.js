/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 03:44:38
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-19 07:08:52
 */

module.exports = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'url': {
      'type': 'string',
      'format': 'url'
    }
  },
  'additionalProperties': false,
  'required': [
    'name',
    'email',
    'url'
  ]
}

/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 06:27:05
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-19 07:09:45
 */

module.exports = {
  'type': 'object',
  'properties': {
    'url': {
      'type': 'string',
      'format': 'url'
    },
    'email': {
      'type': 'string',
      'format': 'email'
    }
  },
  'additionalProperties': false,
  'required': [
    'url',
    'email'
  ]
}

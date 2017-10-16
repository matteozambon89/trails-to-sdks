/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 03:54:19
 * @Last modified by:   Matteo
 * @Last modified time: 2017-10-14 12:27:40
 */

module.exports = {
  'type': 'object',
  'properties': {
    'private': {
      'type': 'boolean',
      'default': true
    }
  },
  'additionalProperties': false,
  'required': ['private']
}

/**
 * @Author: Matteo Zambon <Matteo>
 * @Date:   2017-08-19 06:48:32
 * @Last modified by:   Matteo
 * @Last modified time: 2017-08-19 07:35:01
 */

module.exports = {
  'type': 'object',
  'properties': {
    'global': require('./global'),
    'sdks': require('./sdks')
  },
  'required': ['global', 'sdks'],
  'additionalProperties': false
}
